using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace web_api.Controllers
{
    [EnableCors("SiteCorsPolicy")]
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult Get([FromQuery(Name = "amount")] int amount)
        {
            System.Diagnostics.Debug.WriteLine("########## GET Notifications");
            Console.WriteLine("########## GET Notifications");

            if (!InventoryController.itemTableLoadedFromFile)
            {
                InventoryController c = new InventoryController();
            }

            string result = "{";
            result += "\"items\": [";

            InventoryController.itemTableLock.WaitOne();
            foreach (var item in InventoryController.itemTable)
            {
                if (item.quantity < amount)
                {
                    result += "{";

                    result += "\"name\":\"" + item.name + "\",";
                    result += "\"quantity\":" + item.quantity;

                    result += "},";
                }
            }
            InventoryController.itemTableLock.ReleaseMutex();
            result = result.Remove(result.Length - 1);

            result += "]";
            result += "}";

            return Ok(result);
        }
    }
}
