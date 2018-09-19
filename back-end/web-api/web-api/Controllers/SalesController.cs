using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Reflection;
using System.Threading;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    /// ////////////////////////////////////////////////////////////////////////////////
    /// ////////////////////////////////////////////////////////////////////////////////
    /// SALE:
    /// ////////////////////////////////////////////////////////////////////////////////
    /// ////////////////////////////////////////////////////////////////////////////////

    public class SalePostRecieve
    {
        [Key]
        [Required]
        public int GroupID { get; set; }

        [Required]
        public int ItemID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Date { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Time { get; set; }

        [Required]
        public int NumberInGroup { get; set; }

        [Required]
        public bool LastInGroup { get; set; }
    }

    public class SaleUpdateRecieve
    {
        [Key]
        [Required]
        public int GroupID { get; set; }

        [Required]
        public int ItemID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Date { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Time { get; set; }
    }

    public class SalePostRecieveGroup
    {
        public int groupID;
        public bool foundEndOfGroup = false;
        public int groupLength = 0;
        public List<SalePostRecieve> sales = new List<SalePostRecieve>();
    }

    public class Sale
    {
        public int id;
        public int groupID;
        public int itemID;
        public int quantity;
        public string date;
        public string time;

        public Sale(int id, int groupID, int itemID, int quantity, string date, string time)
        {
            this.id = id;
            this.groupID = groupID;
            this.itemID = itemID;
            this.quantity = quantity;
            this.date = date;
            this.time = time;
        }

        public Sale(string input)
        {
            try
            {
                string[] values = input.Split(',');
                if (values.Length == 6 && Int32.TryParse(values[0], out this.id) && Int32.TryParse(values[1], out this.groupID) && Int32.TryParse(values[2], out this.itemID) && Int32.TryParse(values[3], out this.quantity))
                {
                    this.date = values[4];
                    this.time = values[5];
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public override string ToString()
        {
            return this.id.ToString() + "," + this.groupID.ToString() + "," + this.itemID.ToString() + "," + this.quantity.ToString() + "," + this.date.Replace(",", "") + "," + this.time.Replace(",", "");
        }
    }

    [EnableCors("SiteCorsPolicy")]
    [Route("api/[controller]")]
    public class SalesController : Controller
    {
        private static string salesDatabaseFile;
        public static Mutex salesTableLock = new Mutex();
        public static bool salesTableLoadedFromFile = false;
        public static List<Sale> salesTable = new List<Sale>();

        public static int nextGroup;
        public static Mutex nextGroupLock = new Mutex();

        private static Mutex processingSalesLock = new Mutex();
        private static List<SalePostRecieveGroup> processingSales = new List<SalePostRecieveGroup>();

        public SalesController()
        {
            if (!salesTableLoadedFromFile)
            {
                salesTableLoadedFromFile = true;

                // Get the directory where the database (csv files) are stored:
                salesDatabaseFile = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "../../"); // bin folder
                salesDatabaseFile += "sales.csv";

                // Try and find the database file:
                if (System.IO.File.Exists(salesDatabaseFile))
                {
                    // Load everything into the list:
                    string line;
                    var file = new StreamReader(salesDatabaseFile);
                    while ((line = file.ReadLine()) != null)
                    {
                        try
                        {
                            Sale sale = new Sale(line);
                            salesTableLock.WaitOne();
                            salesTable.Add(sale);

                            nextGroupLock.WaitOne();
                            if (sale.groupID > nextGroup)
                                nextGroup = sale.groupID + 1;
                            nextGroupLock.ReleaseMutex();

                            salesTableLock.ReleaseMutex();
                        }
                        catch (Exception e)
                        {
                            // Sale could not be added
                            System.Diagnostics.Debug.WriteLine(e.StackTrace);
                            Console.WriteLine(e.StackTrace);
                        }
                    }
                    file.Close();
                }

                System.Diagnostics.Debug.WriteLine("########## SALES PATH: " + salesDatabaseFile);
                Console.WriteLine("########## SALES PATH: " + salesDatabaseFile);
            }
        }

        // Helper Method or the Sale Post Request:
        private void ProcessPostGroup(SalePostRecieveGroup group, SalePostRecieve model)
        {
            group.sales.Add(model);
            processingSales.Add(group);
            if (model.LastInGroup)
            {
                group.foundEndOfGroup = true;
                group.groupLength = model.NumberInGroup + 1;
            }

            if (group.foundEndOfGroup)
            {
                // Test to see if all of sales group is present, if so add it ro the list.
                if (group.sales.Count == group.groupLength)
                {
                    System.Diagnostics.Debug.WriteLine("########## SALES GROUP ADDED: " + group);
                    Console.WriteLine("########## SALES GROUP ADDED: " + group);

                    salesTableLock.WaitOne();
                    foreach (var item in group.sales)
                    {
                        Sale sale = new Sale(salesTable.Count + 1, item.GroupID, item.ItemID, item.Quantity, item.Date, item.Time);
                        salesTable.Add(sale);

                        if (!InventoryController.itemTableLoadedFromFile)
                        {
                            InventoryController c = new InventoryController();
                        } 

                        InventoryController.itemTableLock.WaitOne();
                        foreach (var inven in InventoryController.itemTable)
                        {
                            if (inven.id == sale.itemID) 
                            {
                                inven.quantity -= sale.quantity;
                                break;
                            }
                        }

                        var file = new StreamWriter(InventoryController.inventoryDatabaseFile);
                        foreach (var entry in InventoryController.itemTable)
                        {
                            file.WriteLine(entry);
                        }
                        file.Close();
                        InventoryController.itemTableLock.ReleaseMutex();

                        file = new StreamWriter(salesDatabaseFile);
                        foreach (var entry in salesTable)
                        {
                            file.WriteLine(entry);
                        }
                        file.Close();

                    }
                    salesTableLock.ReleaseMutex();

                    processingSales.Remove(group);
                }
            }
        }

        [HttpPost]
        public IActionResult Post(SalePostRecieve model)
        {
            if (model != null)
            {
                if (model.Date != null && model.Time != null) 
                {
                    try
                    {
                        System.Diagnostics.Debug.WriteLine("########## SALES POST: " + model);
                        Console.WriteLine("########## SALES POST: " + model);

                        processingSalesLock.WaitOne();
                        bool foundGroup = false;
                        foreach (var group in processingSales)
                        {
                            if (group.groupID == model.GroupID)
                            {
                                foundGroup = true;
                                ProcessPostGroup(group, model);
                                break;
                            }
                        }
                        if (!foundGroup)
                        {
                            SalePostRecieveGroup group = new SalePostRecieveGroup();
                            group.groupID = model.GroupID;
                            ProcessPostGroup(group, model);
                        }
                        processingSalesLock.ReleaseMutex();

                        // 200 - Success
                        return Ok();
                    }
                    catch (Exception)
                    {
                        // 403 - Forbidden. The request was legal but the server is refusing to respond to it.
                        // The Model is incomplete.
                        return StatusCode(403);
                    }
                }
            }
            return StatusCode(400);
        }

        // Used for getting a single sales group:
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<string>))]
        [ProducesResponseType(404)]
        public IActionResult Get(int id)
        {
            System.Diagnostics.Debug.WriteLine("########## GET ID Sale");
            Console.WriteLine("########## GET ID Sale");

            bool foundBeginning = false;
            List<string> result = new List<string>();
            foreach (var entry in salesTable)
            {
                if (entry.groupID == id)
                {
                    foundBeginning = true;
                    result.Add(entry.ToString());
                }
                else if (foundBeginning)
                {
                    break;
                }
            }

            if (result.Count <= 0) return NotFound();

            return Ok(result);
        }

        // Used for getting all sales items:
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<string>))]
        public IActionResult Get()
        {
            System.Diagnostics.Debug.WriteLine("########## GET Sales");
            Console.WriteLine("########## GET Sales");

            salesTableLock.WaitOne();
            List<string> result = new List<string>();
            foreach (var entry in salesTable)
            {
                result.Add(entry.ToString());
            }
            salesTableLock.ReleaseMutex();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {

            System.Diagnostics.Debug.WriteLine("########## DELETE ID Sale " + id.ToString());
            Console.WriteLine("########## DELETE ID Sale " + id.ToString());

            // Remove the item if it exists
            bool foundSale = false;
            salesTableLock.WaitOne();
            foreach (var line in salesTable)
            {
                if (line.id == id)
                {
                    foundSale = true;

                    if (!InventoryController.itemTableLoadedFromFile)
                    {
                        InventoryController c = new InventoryController();
                    }

                    InventoryController.itemTableLock.WaitOne();
                    foreach (var inven in InventoryController.itemTable)
                    {
                        if (inven.id == line.itemID)
                        {
                            inven.quantity += line.quantity;
                            break;
                        }
                    }

                    var invFile = new StreamWriter(InventoryController.inventoryDatabaseFile);
                    foreach (var entry in InventoryController.itemTable)
                    {
                        invFile.WriteLine(entry);
                    }
                    invFile.Close();
                    InventoryController.itemTableLock.ReleaseMutex();

                    salesTable.Remove(line);
                    break;
                }
            }

            var file = new StreamWriter(salesDatabaseFile);
            foreach (var entry in salesTable)
            {
                file.WriteLine(entry);
            }
            file.Close();
            salesTableLock.ReleaseMutex();

            // If the sale does not exist return a not found.
            if (!foundSale) return StatusCode(400);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, SaleUpdateRecieve model)
        {
            if (model != null)
            {
                try
                {
                    System.Diagnostics.Debug.WriteLine("########## PUT ID Inventory " + id.ToString());
                    Console.WriteLine("########## PUT ID Inventory " + id.ToString());

                    Sale newSale = new Sale(id, model.GroupID, model.ItemID, model.Quantity, model.Date, model.Time);

                    // Check to see if the item exists
                    bool found = false;
                    salesTableLock.WaitOne();
                    for (int i = 0; i < salesTable.Count; i++)
                    {
                        // If item is found, replace with updated data
                        if (salesTable[i].id == id)
                        {
                            if (!InventoryController.itemTableLoadedFromFile)
                            {
                                InventoryController c = new InventoryController();
                            }

                            InventoryController.itemTableLock.WaitOne();
                            foreach (var inven in InventoryController.itemTable)
                            {
                                if (inven.id == salesTable[i].itemID)
                                {
                                    found = true;
                                    inven.quantity += salesTable[i].quantity;
                                    salesTable[i] = newSale;
                                    inven.quantity -= salesTable[i].quantity;
                                    break;
                                }
                            }

                            var invFile = new StreamWriter(InventoryController.inventoryDatabaseFile);
                            foreach (var entry in InventoryController.itemTable)
                            {
                                invFile.WriteLine(entry);
                            }
                            invFile.Close();
                            InventoryController.itemTableLock.ReleaseMutex();
                            break;
                        }
                    }

                    // Save File
                    var file = new StreamWriter(salesDatabaseFile);
                    foreach (var entry in salesTable)
                    {
                        file.WriteLine(entry);
                    }
                    file.Close();
                    salesTableLock.ReleaseMutex();

                    // If the item does not exist return a not found.
                    if (!found) return StatusCode(400);

                    return Ok();
                }
                catch (Exception)
                {
                    // Internal Error
                    return StatusCode(500);
                }
            }

            // 400 - Failure
            return StatusCode(400);
        }
    }

    // This is a helper class to mamnage getting unique group
    // id's for new sales that are being added:
    [EnableCors("SiteCorsPolicy")]
    [Route("api/[controller]")]
    public class GroupController : Controller
    {
        static bool loadSalesOnce_hack = false;

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(int))]
        public IActionResult Get()
        {
            // This is done to fix the isue where the sales may
            // not be loaded before a group get is made.
            if (!loadSalesOnce_hack)
            {
                loadSalesOnce_hack = true;
                SalesController sc = new SalesController();
            }

            System.Diagnostics.Debug.WriteLine("########## GROUP GET: ");
            Console.WriteLine("########## GROUP GET: ");

            SalesController.nextGroupLock.WaitOne();
            int result = SalesController.nextGroup++;
            SalesController.nextGroupLock.ReleaseMutex();

            return Ok(result);
        }
    }

}
