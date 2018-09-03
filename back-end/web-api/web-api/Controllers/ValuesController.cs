using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    // NOTE(Xavier): This class can be moved into a
    // different file if you want, I don't mind.
    public class InventoryItem
    {
        public int id;
        public string name;
        public string description;
        public string barcode;
        public string purchasePrice;
        public string retailPrice;
        public int quantity;

        // NOTE(Xavier): There is more to concider here...
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
            string result = id.ToString() + "," + name + "," + description + "," + barcode + "," + purchasePrice + "," + retailPrice + "," + quantity;
            return result;
        }
    }

    /// //////////////////////////////////////////////////////////

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
        public IActionResult Post(string values)
        {
            if (!string.IsNullOrEmpty(values))
            {
                try
                {
                    InventoryItem item = new InventoryItem(values);
                    itemTableLock.WaitOne();
                    itemTable.Add(item);
                    itemTableLock.ReleaseMutex();

                    System.Diagnostics.Debug.WriteLine("########## POST: " + values);
                    Console.WriteLine("########## POST: " + values);

                    // NOTE(Xavier): This is probably not the best idea
                    // because it will be called for each request.
                    itemTableLock.WaitOne();
                    var file = new StreamWriter(inventoryDatabaseFile);
                    foreach (var entry in itemTable)
                    {
                        file.WriteLine(entry.ToString());
                    }
                    file.Close();
                    itemTableLock.ReleaseMutex();

                    return Ok();
                }
                catch (Exception)
                {
                    return StatusCode(400);
                }
            }
            return StatusCode(400);
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
