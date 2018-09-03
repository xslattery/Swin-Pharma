using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    // Databases

    // NOTE(Xavier): leave this comment for now
    // Console.WriteLine("PATH: " + System.Reflection.Assembly.GetExecutingAssembly().Location);

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
            string[] values = input.Split(',');
            if (Int32.TryParse(values[0], out id))
            {

            }
            else
            {
                // NOTE(Xavier): How should be handle this??
                // Should we throw an exception if it fails?
            }
        }

        public override string ToString()
        {
            string result = id.ToString() + "," + name + "," + description + "," + barcode + "," + purchasePrice + "," + retailPrice + "," + quantity;
            return result;
        }
    }

    [Route("api/[controller]")]
    public class InventoryController : Controller
    {
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
            System.Diagnostics.Debug.WriteLine("########## POST" + values);
            Console.WriteLine("########## POST" + values);
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
