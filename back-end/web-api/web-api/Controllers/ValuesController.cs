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
    public class InventoryItemPostRecieve
    {
        [Key]
        [Required]
        [DataType(DataType.Text)]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Description { get; set; }

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
        public string description;
        public string barcode;
        public string purchasePrice;
        public string retailPrice;
        public int quantity;

        public InventoryItem(int _id, string _name, string _description, string _barcode, string _purchasePrice, string _retailPrice, int _quantity)
        {
            id = _id;
            name = _name;
            description = _description;
            barcode = _barcode;
            purchasePrice = _purchasePrice;
            retailPrice = _retailPrice;
            quantity = _quantity;
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
                if (values.Length == 7 && Int32.TryParse(values[0], out id) && Int32.TryParse(values[6], out quantity))
                {
                    name = values[1];
                    description = values[2];
                    barcode = values[3];
                    purchasePrice = values[4];
                    retailPrice = values[5];
                }
                else
                {
                    // NOTE(Xavier): How should be handle this??
                    // For now I guess we can just go with throwing an exception for now:
                    throw new Exception(); // I dont think it matters what type of exception, only the fact that one is thrown.
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public override string ToString()
        {
            string result = id.ToString() + "," + name.Replace(",", "") + "," + description.Replace(",", "") + "," + barcode.Replace(",", "") + "," + purchasePrice.Replace(",", "") + "," + retailPrice.Replace(",", "") + "," + quantity;
            return result;
        }
    }


    /// ////////////////////////////////////////////////////////////////////////////////////////


    [Route("api/[controller]")]
    public class InventoryController : Controller
    {
        private static List<InventoryItem> itemTable = new List<InventoryItem>();
        private static bool itemTableLoadedFromFile = false;
        private static Mutex itemTableLock = new Mutex();
        private static string inventoryDatabaseFile;

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

                System.Diagnostics.Debug.WriteLine("########## PATH: " + inventoryDatabaseFile);
                Console.WriteLine("########## PATH: " + inventoryDatabaseFile);
            }
        }

        // Used for getting all inventory items:
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    System.Diagnostics.Debug.WriteLine("########## GET Inventory");
        //    Console.WriteLine("########## GET Inventory");

        //    List<string> result = new List<string>();
        //    foreach (var entry in itemTable)
        //    {
        //        result.Add(entry.ToString());
        //    }

        //    return result;
        //}

        //// Used for getting a single inventory item:
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    System.Diagnostics.Debug.WriteLine("########## GET ID Inventory");
        //    Console.WriteLine("########## GET ID Inventory");

        //    List<string> result = new List<string>();
        //    foreach (var entry in itemTable)
        //    {
        //        if (entry.id == id)
        //        {
        //            return entry.ToString();
        //        }
        //    }
        //    return ""; // NOTE(Xavier): maybe this should be an error code instead of an empty string.
        //}

        // Used For adding a single inventory item:
        [HttpPost]
        public IActionResult Post(InventoryItemPostRecieve model)
        {
            System.Diagnostics.Debug.WriteLine("########## POST: " + model);
            Console.WriteLine("########## POST: " + model);

            if (model != null)
            {
                try
                {
                    itemTableLock.WaitOne();
                    InventoryItem item = new InventoryItem(itemTable.Count + 1, model.Name, model.Description, model.Barcode, model.PurchasePrice, model.RetailPrice, model.Quantity);
                    itemTable.Add(item);
                    itemTableLock.ReleaseMutex();

                    System.Diagnostics.Debug.WriteLine("########## POST: " + item);
                    Console.WriteLine("########## POST: " + item);

                    // NOTE(Xavier): This is probably not the best idea
                    // because it will be called for each request.
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
            } else
            {
                // 400 - Failure
                return StatusCode(400);
            }
        }
    }

    // NOTE(Xavier): This will be implemented
    // when we are at that stage.
    //[Route("api/[controller]")]
    //public class SalesController : Controller
    //{
    //[HttpGet]
    //public IEnumerable<string> Get()
    //{
    //    System.Diagnostics.Debug.WriteLine("########## GET Sales");
    //    Console.WriteLine("########## GET Sales");
    //    return new string[] { "Sale 1", "Sale 2" };
    //}

    //[HttpPost]
    //public void Post(string values)
    //{
    //    System.Diagnostics.Debug.WriteLine("########## POST" + values);
    //    Console.WriteLine("########## POST" + values);
    //}
    //}

}
