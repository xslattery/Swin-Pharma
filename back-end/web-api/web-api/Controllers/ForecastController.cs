using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    [EnableCors("SiteCorsPolicy")]
    [Route("api/[controller]")]
    public class ForecastController : Controller
    {
        // Generateing the weekly forecast:
        [HttpGet]
        [Route("Week/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetWeek([FromQuery(Name = "todayDate")] string today, [FromQuery(Name = "date")] string date)
        {
            System.Diagnostics.Debug.WriteLine("########## FORECAST WEEK GET Inventory");
            Console.WriteLine("########## FORECAST WEEK GET Inventory");

            DateTime startDate;
            DateTime todayDate;
            if (DateTime.TryParse(date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out startDate) && DateTime.TryParse(today, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out todayDate))
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

                TimeSpan differenceDate = todayDate - startDate;
                int difference = differenceDate.Days;
                int dayLength = difference + 1;
                int forecastLength = 7 - difference - 1;
                if (difference >= 7)
                {
                    dayLength = 7;
                    forecastLength = 0;
                }
                else if (difference == 0)
                {
                    dayLength = 1;
                    forecastLength = 6;
                }
                else if (difference < 0)
                {
                    dayLength = 0;
                    forecastLength = 7;
                }

                if (dayLength > 7) dayLength = 7;
                if (forecastLength > 7) forecastLength = 7;

                string result = "{";
                result += "\"row\": [";

                InventoryController.itemTableLock.WaitOne();
                foreach (var item in InventoryController.itemTable)
                {
                    result += "{";
                    result += "\"name\":\"" + item.name + "\",";

                    result += "\"day\": [ ";
                    for (int i = 0; i < dayLength; i++)
                    {
                        double rollingAverage = 0; 
                        double averageCounter = 0;
                        DateTime currentDate = startDate.AddDays(i);

                        SalesController.salesTableLock.WaitOne();
                        foreach (var sale in SalesController.salesTable)
                        {
                            if (item.id == sale.itemID)
                            {
                                DateTime compareDate;
                                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out compareDate))
                                {
                                    if (compareDate.DayOfWeek == currentDate.DayOfWeek)
                                    {
                                        rollingAverage += Double.Parse(item.purchasePrice) * sale.quantity;
                                        averageCounter++;
                                    }
                                }
                            }
                        }
                        SalesController.salesTableLock.ReleaseMutex();

                        result += (rollingAverage/averageCounter) + ",";
                    }
                    result = result.Remove(result.Length - 1);
                    result += "],";

                    result += "\"forecast\": [ ";
                    for (int i = dayLength; i < dayLength + forecastLength; i++)
                    {
                        double rollingAverage = 0;
                        double averageCounter = 0;
                        DateTime currentDate = startDate.AddDays(i);

                        SalesController.salesTableLock.WaitOne();
                        foreach (var sale in SalesController.salesTable)
                        {
                            if (item.id == sale.itemID)
                            {
                                DateTime compareDate;
                                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out compareDate))
                                {
                                    if (compareDate.DayOfWeek == currentDate.DayOfWeek)
                                    {
                                        rollingAverage += Double.Parse(item.purchasePrice) * sale.quantity;
                                        averageCounter++;
                                    }
                                }
                            }
                        }
                        SalesController.salesTableLock.ReleaseMutex();

                        result += (rollingAverage/averageCounter) + ",";
                    }
                    result = result.Remove(result.Length - 1);
                    result += "]";
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
    }
}
