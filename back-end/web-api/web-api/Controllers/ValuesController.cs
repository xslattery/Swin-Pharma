﻿using System;
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
    /// INVENTORY:
    /// ////////////////////////////////////////////////////////////////////////////////
    /// ////////////////////////////////////////////////////////////////////////////////

    public class InventoryItemPostRecieve
    {
        [Key]
        [Required]
        [DataType(DataType.Text)]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Brand { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Barcode { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string PurchasePrice { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string RetailPrice { get; set; }

        [Required]
        public int Quantity { get; set; }
    }

    public class InventoryItem
    {
        public int id;
        public string name;
        public string brand;
        public string barcode;
        public string purchasePrice;
        public string retailPrice;
        public int quantity;

        public InventoryItem(int id, string name, string brand, string barcode, string purchasePrice, string retailPrice, int quantity)
        {
            this.id = id;
            this.name = name;
            this.brand = brand;
            this.barcode = barcode;
            this.purchasePrice = purchasePrice;
            this.retailPrice = retailPrice;
            this.quantity = quantity;
        }

        // FIXME(Xavier): There is more to concider here...
        // If any of the members have a comma inside them then passing them will fail.
        // maybe we could concider surrounding them in '{ }'??? Then only the contents
        // of the brackets will be included.
        //
        // Create an inventory item from a comma
        // seperated list of attributes:
        public InventoryItem(string input)
        {
            try
            {
                string[] values = input.Split(',');
                if (values.Length == 7 && Int32.TryParse(values[0], out this.id) && Int32.TryParse(values[6], out this.quantity))
                {
                    this.name = values[1];
                    this.brand = values[2];
                    this.barcode = values[3];
                    this.purchasePrice = values[4];
                    this.retailPrice = values[5];
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
            return this.id.ToString() + "," + this.name.Replace(",", "") + "," + this.brand.Replace(",", "") + "," + this.barcode.Replace(",", "") + "," + this.purchasePrice.Replace(",", "") + "," + this.retailPrice.Replace(",", "") + "," + this.quantity.ToString();
        }
    }

    [EnableCors("SiteCorsPolicy")]
    [Route("api/[controller]")]
    public class InventoryController : Controller
    {
        public static string inventoryDatabaseFile;
        public static Mutex itemTableLock = new Mutex();
        public static bool itemTableLoadedFromFile = false;
        public static List<InventoryItem> itemTable = new List<InventoryItem>();
        private static int nextItemID = 1;

        public InventoryController() : base()
        {
            if (!itemTableLoadedFromFile)
            {
                itemTableLoadedFromFile = true;

                // Get the directory where the database (csv files) are stored:
                inventoryDatabaseFile = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "../../"); // bin folder
                inventoryDatabaseFile += "inventory.csv";

                // Try and find the database file:
                if (System.IO.File.Exists(inventoryDatabaseFile))
                {
                    // Load everything into the list:
                    string line;
                    var file = new StreamReader(inventoryDatabaseFile);
                    while ((line = file.ReadLine()) != null)
                    {
                        try
                        {
                            InventoryItem item = new InventoryItem(line);
                            itemTableLock.WaitOne();
                            if (item.id > nextItemID)
                                nextItemID = item.id + 1;
                            itemTable.Add(item);
                            itemTableLock.ReleaseMutex();
                        }
                        catch (Exception)
                        {
                            // Item could not be added
                        }
                    }
                    file.Close();
                }

                System.Diagnostics.Debug.WriteLine("########## INVENTORY PATH: " + inventoryDatabaseFile);
                Console.WriteLine("########## INVENTORY PATH: " + inventoryDatabaseFile);
            }
        }

        // Used for getting all inventory items:
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<string>))]
        public IActionResult Get()
        {
            System.Diagnostics.Debug.WriteLine("########## GET Inventory");
            Console.WriteLine("########## GET Inventory");

            List<string> result = new List<string>();
            foreach (var entry in itemTable)
            {
                result.Add(entry.ToString());
            }

            return Ok(result);
        }

        // Used for getting a single inventory item:
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(string))]
        [ProducesResponseType(404)]
        public IActionResult Get(int id)
        {
            System.Diagnostics.Debug.WriteLine("########## GET ID Inventory");
            Console.WriteLine("########## GET ID Inventory");

            List<string> result = new List<string>();
            foreach (var entry in itemTable)
            {
                if (entry.id == id)
                {
                    return Ok(entry.ToString());
                }
            }

            return NotFound();
        }

        // Used For adding a single inventory item:
        [HttpPost]
        public IActionResult Post(InventoryItemPostRecieve model)
        {
            if (model != null)
            {
                if (model.Name != null && model.Brand != null && model.Barcode != null && model.RetailPrice != null && model.PurchasePrice != null)
                {
                    try
                    {
                        itemTableLock.WaitOne();
                        InventoryItem item = new InventoryItem(nextItemID++, model.Name, model.Brand, model.Barcode, model.PurchasePrice, model.RetailPrice, model.Quantity);
                        itemTable.Add(item);
                        itemTableLock.ReleaseMutex();

                        System.Diagnostics.Debug.WriteLine("########## INVENTORY POST: " + model);
                        Console.WriteLine("########## INVENTORY POST: " + model);

                        // NOTE(Xavier): It is probably not the best idea to do this
                        // here because it will be called for each request.
                        itemTableLock.WaitOne();
                        var file = new StreamWriter(inventoryDatabaseFile);
                        foreach (var entry in itemTable)
                        {
                            file.WriteLine(entry);
                        }
                        file.Close();
                        itemTableLock.ReleaseMutex();

                        // 200 - Success
                        return StatusCode(200);
                    }
                    catch (Exception)
                    {
                        // 403 - Forbidden. The request was legal but the server is refusing to respond to it.
                        // The Model is incomplete.
                        return StatusCode(403);
                    }
                }
            }

            // 400 - Failure
            return StatusCode(400);
        }

        // Used to delete a single inventory item:
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {

            System.Diagnostics.Debug.WriteLine("########## DELETE ID Inventory " + id.ToString());
            Console.WriteLine("########## DELETE ID Inventory " + id.ToString());

            // Remove the item if it exists
            bool foundItem = false;
            itemTableLock.WaitOne();
            foreach (var line in itemTable)
            {
                if (line.id == id)
                {
                    foundItem = true;
                    itemTable.Remove(line);
                    break;
                }
            }

            var file = new StreamWriter(inventoryDatabaseFile);
            foreach (var entry in itemTable)
            {
                file.WriteLine(entry);
            }
            file.Close();
            itemTableLock.ReleaseMutex();

            // If the item does not exist return a not found.
            if (!foundItem) return StatusCode(400);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, InventoryItemPostRecieve model)
        {
            if (model != null)
            {
                try
                {
                    System.Diagnostics.Debug.WriteLine("########## PUT ID Inventory " + id.ToString());
                    Console.WriteLine("########## PUT ID Inventory " + id.ToString());

                    InventoryItem newItem = new InventoryItem(id, model.Name, model.Brand, model.Barcode, model.PurchasePrice, model.RetailPrice, model.Quantity);

                    // Check to see if the item exists
                    bool foundItem = false;
                    itemTableLock.WaitOne();
                    for (int i = 0; i < itemTable.Count; i++)
                    {
                        // If item is found, replace with updated data
                        if (itemTable[i].id == id)
                        {
                            foundItem = true;
                            itemTable[i] = newItem;
                            break;
                        }
                    }

                    // Save File
                    var file = new StreamWriter(inventoryDatabaseFile);
                    foreach (var entry in itemTable)
                    {
                        file.WriteLine(entry);
                    }
                    file.Close();
                    itemTableLock.ReleaseMutex();

                    // If the item does not exist return a not found.
                    if (!foundItem) return StatusCode(400);

                    return Ok();
                }
                catch (Exception)
                {
                    // Internal Error
                    return StatusCode(500);
                }
            }
            else
            {
                // 400 - Failure
                return StatusCode(400);
            }
        }
    }

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
        private static Mutex salesTableLock = new Mutex();
        private static bool salesTableLoadedFromFile = false;
        private static List<Sale> salesTable = new List<Sale>();

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
