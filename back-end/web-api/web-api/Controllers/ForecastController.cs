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
        /// ///////////////////////////////////////////////////////////
        /// Individual Forecasting:
        /// ///////////////////////////////////////////////////////////

        // Generateing the weekly forecast, all items:
        [HttpGet]
        [Route("Individual/Week/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetWeek ([FromQuery(Name = "todayDate")] string today, [FromQuery(Name = "date")] string date)
        {
            System.Diagnostics.Debug.WriteLine("########## FORECAST GetWeekSingle GET Inventory");
            Console.WriteLine("########## FORECAST GetWeekSingle GET Inventory");

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


        // Generateing the monthly forecast, all items:
        [HttpGet]
        [Route("Individual/Month/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetMonth([FromQuery(Name = "todayDate")] string today, [FromQuery(Name = "date")] string date)
        {
            System.Diagnostics.Debug.WriteLine("########## FORECAST MONTH GET Inventory");
            Console.WriteLine("########## FORECAST MONTH GET Inventory");

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

                int dayOffset = (int)startDate.Day;
                startDate = startDate.AddDays(-dayOffset + 1);
                int monthLength = DateTime.DaysInMonth(startDate.Year, startDate.Month);

                TimeSpan differenceDate = todayDate - startDate;
                int difference = differenceDate.Days;
                int dayLength = difference + 1;
                int forecastLength = monthLength - difference - 1;

                if (difference >= monthLength)
                {
                    dayLength = monthLength;
                    forecastLength = 0;
                }
                else if (difference == 0)
                {
                    dayLength = 1;
                    forecastLength = monthLength - 1;
                }
                else if (difference < 0)
                {
                    dayLength = 0;
                    forecastLength = monthLength;
                }
                if (dayLength > monthLength) dayLength = monthLength;
                if (forecastLength > monthLength) forecastLength = monthLength;

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
                        double proffit = 0;
                        DateTime currentDate = startDate.AddDays(i);

                        SalesController.salesTableLock.WaitOne();
                        foreach (var sale in SalesController.salesTable)
                        {
                            if (item.id == sale.itemID)
                            {
                                DateTime compareDate;
                                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), DateTimeStyles.AssumeLocal, out compareDate))
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
                                    if (compareDate.Day == currentDate.Day)
                                    {
                                        rollingAverage += Double.Parse(item.purchasePrice) * sale.quantity;
                                        averageCounter++;
                                    }
                                }
                            }
                        }
                        SalesController.salesTableLock.ReleaseMutex();

                        if (averageCounter > 0)
                        {
                            result += (rollingAverage / averageCounter) + ",";
                        }
                        else
                        {
                            result += 0 + ",";
                        }
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


        /// ///////////////////////////////////////////////////////////
        /// Group Forecasting:
        /// ///////////////////////////////////////////////////////////


        private class GroupForecastData
        {
            public string name;
            public List<double> forecastRunningTotall;
            public List<int> forecastRunningCount;

            public GroupForecastData(string name, int length)
            {
                this.name = name;
                this.forecastRunningTotall = new List<double>(length);
                this.forecastRunningCount = new List<int>(length);
            }
        }


        // Generateing the weekly group forecast:
        [HttpGet]
        [Route("Group/Week/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetWeekGroup([FromQuery(Name = "todayDate")] string today, [FromQuery(Name = "date")] string date)
        {
            // ASSUMPTION:
            // This will return a JSON file that will contain
            // a list of groups (Brands) with predictions for the month
            // ALL groups will be returned together.

            // todayDate - will be the day the forcast is being generated (used to know where actual data ends and predictions begin)
            // startDate - will be any date in the week the forcast will be generated for
            DateTime todayDate;
            DateTime startDate;
            if (!DateTime.TryParse(date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out startDate) || !DateTime.TryParse(today, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out todayDate))
            {
                // Failed to parse the dates.
                return StatusCode(400);
            }

            // 1. Load Sales & Inventory Controllers (if not already) (for loading the data)
            if (!InventoryController.itemTableLoadedFromFile)
            {
                InventoryController c = new InventoryController();
            }

            if (!SalesController.salesTableLoadedFromFile)
            {
                SalesController sc = new SalesController();
            }

            // 2. Get the date of the start of the week
            int weekStartOffset = (int)startDate.DayOfWeek;
            DateTime weekStartDate = startDate.AddDays(-weekStartOffset);

            // 3. Get the number of days in the week that have alread passed
            // 4. Get the number of days in the week that will be predicted
            //    (It is possible for the week to be entiraly existing data or entrialy predictions)
            TimeSpan differenceDate = weekStartDate - startDate;
            int weekStartDate_startDate_difference = differenceDate.Days;

            int actualDays = 0;
            int forecastDays = 0;

            // TODO(Xavier):
            // The values for 'acutalDays' and 'forecastDays' need
            // to be calculated. Combined they should not be greater
            // than 7

            // 5. Generate a dictionary of groups (Brands)
            //    This will be done by looping over every item and adding is brand if it does not already exist in the dictionary.
            Dictionary<string, GroupForecastData> groupData = new Dictionary<string, GroupForecastData>();
            InventoryController.itemTableLock.WaitOne();
            foreach (var item in InventoryController.itemTable)
            {
                if (!groupData.ContainsKey(item.brand)) groupData.Add(item.brand, new GroupForecastData(item.brand, 7));
            }
            InventoryController.itemTableLock.ReleaseMutex();

            // 6. Loop over every sale and populate the data in the dictionary
            //    - Adding to the running total and count for each day
            SalesController.salesTableLock.WaitOne();
            InventoryController.itemTableLock.WaitOne();
            foreach (var sale in SalesController.salesTable)
            {
                DateTime saleDate;
                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out saleDate))
                {
                    // Get the item from the sale (used to find out the sales brand)
                    InventoryItem item = null;
                    foreach (var compareItem in InventoryController.itemTable)
                    {
                        if (sale.itemID == compareItem.id) item = compareItem;
                    }

                    groupData[item.brand].forecastRunningTotall[(int)saleDate.DayOfWeek] += Double.Parse(item.purchasePrice) * sale.quantity;
                    groupData[item.brand].forecastRunningCount[(int)saleDate.DayOfWeek] += 1;
                }
            }
            InventoryController.itemTableLock.ReleaseMutex();
            SalesController.salesTableLock.ReleaseMutex();

            // TODO(Xavier):
            // 7. Generate a JSON file based off of the data

            return StatusCode(400);
        }


        // Generateing the monthly group forecast:
        [HttpGet]
        [Route("Group/Month/")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult GetMonthGroup([FromQuery(Name = "todayDate")] string today, [FromQuery(Name = "date")] string date)
        {
            // ASSUMPTION:
            // This will return a JSON file that will contain
            // a list of groups (Brands) with predictions for the month
            // ALL groups will be returned together.

            // todayDate - will be the day the forcast is being generated (used to know where actual data ends and predictions begin)
            // date - will be any date in the month the forcast will be generated for

            // 1. Load Sales & Inventory Controllers (if not already) (for loading the data)

            // 2. Get the date of the start of the month

            // 3. Get the number of days in the month that have alread passed (use start date)
            // 4. Get the number of days in the month that will be predicted
            //    (It is possible for the month to be entiraly existing data or entrialy predictions)

            // 5. Generate a dictionary of groups (Brands)
            //    This will be done by looping over every item and adding is brand if it does not already exist in the dictionary.
            // Each entry (Brand) in the diction will contain a class containing:
            // class {
            //      string brandName;
            //      List<double> runningTotal;   <- one entry for each
            //      List<int> runningCount;      <- day of the month
            // }

            // 6. Loop over every sale and populate the data in the dictionary
            //    - Adding to the running total and count for each day

            // 7. Generate a JSON file based off of the data
            //    - Will require dividing the running totals by the conuts for each day to get the average

            return StatusCode(400);
        }


    }
}

