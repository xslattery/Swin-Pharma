using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Threading;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    [EnableCors("SiteCorsPolicy")]
    [Route("api/[controller]")]
    public class ReportController : Controller
    {
        private string[] daysOfWeek = { "sun", "mon", "tue", "wed", "thu", "fri", "sat" };

        [HttpGet]
        [Route("Week/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetWeek([FromQuery(Name = "date")] string date)
        {
            System.Diagnostics.Debug.WriteLine("########## REPORT WEEK GET Inventory");
            Console.WriteLine("########## REPORT WEEK GET Inventory");

            DateTime startDate;
            if (DateTime.TryParse(date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out startDate))
            {
                if (!InventoryController.itemTableLoadedFromFile)
                {
                    InventoryController c = new InventoryController();
                }

                if (!SalesController.salesTableLoadedFromFile)
                {
                    SalesController sc = new SalesController();
                }

                int dayOffset = (int)startDate.DayOfWeek;
                startDate = startDate.AddDays(-dayOffset);

                //System.Diagnostics.Debug.WriteLine("########## " + startDate.ToShortDateString());

                string result = "{";
                result += "\"row\": [";

                InventoryController.itemTableLock.WaitOne();
                foreach (var item in InventoryController.itemTable)
                {
                    result += "{";
                    result += "\"name\":\"" + item.name + "\",";

                    for (int i = 0; i < 7; i++)
                    {
                        double proffit = 0;
                        DateTime currentDate = startDate.AddDays(i);

                        SalesController.salesTableLock.WaitOne();
                        foreach (var sale in SalesController.salesTable)
                        {
                            if (item.id == sale.itemID)
                            {
                                DateTime compareDate;
                                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out compareDate))
                                {
                                    if (compareDate == currentDate)
                                    {
                                        proffit += Double.Parse(item.purchasePrice) * sale.quantity;
                                    }
                                }
                            }
                        }
                        SalesController.salesTableLock.ReleaseMutex();

                        result += "\"" + daysOfWeek[i] + "\":" + proffit + ",";
                    }
                    result = result.Remove(result.Length - 1);

                    result += "},";
                }
                InventoryController.itemTableLock.ReleaseMutex();
                result = result.Remove(result.Length - 1);

                result += "]";
                result += "}";

                return Ok(result);
            }

            return StatusCode(400);
        }









        [HttpGet]
        [Route("Month/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetMonth([FromQuery(Name = "date")] string date)
        {
            System.Diagnostics.Debug.WriteLine("########## REPORT MONTH GET Inventory");
            Console.WriteLine("########## REPORT MONTH GET Inventory");

            DateTime startDate;
            if (DateTime.TryParse(date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out startDate))
            {
                if (!InventoryController.itemTableLoadedFromFile)
                {
                    InventoryController c = new InventoryController();
                }

                if (!SalesController.salesTableLoadedFromFile)
                {
                    SalesController sc = new SalesController();
                }

                int dayOffset = (int)startDate.Day - 1;
                startDate = startDate.AddDays(-dayOffset);

                System.Diagnostics.Debug.WriteLine("########## " + startDate.ToShortDateString());


                string result = "{";
                result += "\"rows\": [";

                foreach (var item in InventoryController.itemTable)
                {
                    result += "{\n";
                    result += "\"name\":\"" + item.name + "\",";
                    result += "\"values\": [";

                    for (int i = 0; i < DateTime.DaysInMonth(startDate.Year, startDate.Month); i++)
                    {

                        double proffit = 0;
                        DateTime currentDate = startDate.AddDays(i);

                        SalesController.salesTableLock.WaitOne();
                        foreach (var sale in SalesController.salesTable)
                        {
                            if (item.id == sale.itemID)
                            {
                                DateTime compareDate;
                                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out compareDate))
                                {
                                    if (compareDate == currentDate)
                                    {
                                        proffit += Double.Parse(item.purchasePrice) * sale.quantity;
                                    }
                                }
                            }
                        }
                        SalesController.salesTableLock.ReleaseMutex();

                        result += proffit + ",";
                    }
                    result = result.Remove(result.Length - 1);

                    result += "]";
                    result += "},";
                }
                result = result.Remove(result.Length - 1);

                result += "]";
                result += "}";

                return Ok(result);
            }

            return StatusCode(400);
        }
    }
}
