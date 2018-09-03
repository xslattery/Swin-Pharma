using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    // Databases

    [Route("inventory/[controller]")]
    public class InventoryController : Controller
    {
        // GET inventory/values (ALL VALUES)

        // GET between two dates

        // PUT 
    }

    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            System.Diagnostics.Debug.WriteLine("########## GET");
            Console.WriteLine("########## GET");

            Console.WriteLine("PATH: " + System.Diagnostics.Process.GetCurrentProcess());

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
}
