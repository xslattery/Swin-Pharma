using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    // NOTE(Xavier): This class can be moved into a
    // different file if you want, I don't mind.
    public class InventoryItem
    {
        private int id;
        private string name;
        private string description;
        private string barcode;
        private string purchasePrice;
        private string retailPrice;
        private int quantity;

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
                if (Int32.TryParse(values[0], out id) && Int32.TryParse(values[6], out quantity))
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
                    // - Should we throw an exception if it fails?
                    // - Then the item will not be created and it will be skipped??
                    // - An error can be sent back to the user??
                    // - i.e. the post failed so an error code is returned??
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
        // NOTE(Xavier) A mutex may be neede to avoid colissions from multiple threads???
        // - Reason discussed below (above constructor)
        private static List<InventoryItem> itemTable = new List<InventoryItem>();
        private static bool itemTableLoadedFromFile = false;
        private static Mutex itemTableLock = new Mutex();

        // NOTE(Xavier): A constructor is required to load the Inventory from a csv file.
        // However I have realised that we probaly should not store the list of items 
        // in this calss because many instances of this class will be created for the requests.
        // - Am I wrong about this??? (I just checked and the constructor is called with every request)
        // For not I have made the list static and added a boolean check to make sure
        // the list is only loaded once.
        public InventoryController() : base()
        {
            if (!itemTableLoadedFromFile)
            {
                itemTableLoadedFromFile = true;

                // FIXME(Xavier): Do forward slashes '/' work on windows for paths???
                //
                // Get the directory where the database (csv files) are stored:
                string path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "../../"); // bin folder
                path += "inventory.csv";

                // Try and find the database file:
                if (System.IO.File.Exists(path))
                {
                    // Load everything into the list:
                    string line;
                    var file = new StreamReader(path);
                    while ((line = file.ReadLine()) != null)
                    {
                        try
                        {
                            InventoryItem item = new InventoryItem(line);
                            itemTable.Add(item);
                        }
                        catch (Exception)
                        {
                            // NOTE(Xavier): Item could not be added
                        }
                    }
                    file.Close();
                }

                System.Diagnostics.Debug.WriteLine("########## PATH: " + path);
                Console.WriteLine("########## PATH: " + path);
            }
        }

        // NOTE(Xavier): This will be implemented
        // when we are at that stage.
        // Used for getting all inventory items:
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    System.Diagnostics.Debug.WriteLine("########## GET Inventory");
        //    Console.WriteLine("########## GET Inventory");
        //    return new string[] { "Item 1", "Item 2" };
        //}

        // Used For getting a single inventory item:
        [HttpPost]
        public void Post(string values)
        {
            if (!string.IsNullOrEmpty(values))
            {
                try
                {
                    InventoryItem item = new InventoryItem(values);
                    itemTable.Add(item);
                }
                catch (Exception)
                {
                    // NOTE(Xavier): Item could not be added
                }
            }

            // TODO(Xavier): Save the list to file...
            // - Not sure how often this should be done??
            // - Maybe only when the destructor is called??
            // - A mutex will be required to avid collisions.
            //   due to how multiple instances of this class can
            //   exist at once.

            System.Diagnostics.Debug.WriteLine("########## POST: " + values);
            Console.WriteLine("########## POST: " + values);
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


/* This is the old api/values controller example:
---------------------------------------------------------
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            System.Diagnostics.Debug.WriteLine("########## GET");
            Console.WriteLine("########## GET");

            Console.WriteLine("PATH: " + System.Reflection.Assembly.GetExecutingAssembly().Location);

            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            System.Diagnostics.Debug.WriteLine("########## GET ID");
            Console.WriteLine("########## GET ID");
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post(string values)
        {
            System.Diagnostics.Debug.WriteLine("########## POST" + values);
            Console.WriteLine("########## POST" + values);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {

        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
--------------------------------------------------------------
 */
