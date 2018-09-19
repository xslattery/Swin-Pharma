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
}
