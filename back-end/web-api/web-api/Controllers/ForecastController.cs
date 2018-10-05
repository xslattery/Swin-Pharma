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
            public List<double> forecastRunningTotal;
            public List<int> forecastRunningCount;

            public GroupForecastData(string name, int length)
            {
                this.name = name;
                this.forecastRunningTotal = new List<double>(length);
                this.forecastRunningCount = new List<int>(length);

                for (int i = 0; i < length; i++)
                {
                    this.forecastRunningTotal.Add(0);
                    this.forecastRunningCount.Add(0);
                }
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
            if (!DateTime.TryParse(date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out startDate) 
                || !DateTime.TryParse(today, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out todayDate))
            {
                // Failed to parse the dates.
                return StatusCode(400);
            }

            // Load Sales & Inventory Controllers (if not already) (for loading the data)
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

            // Get the number of days in the week that have alread passed
            // Get the number of days in the week that will be predicted
            //    (It is possible for the week to be entiraly existing data or entrialy predictions)
            TimeSpan differenceDate =  todayDate - weekStartDate;
            int weekStartDate_startDate_difference = differenceDate.Days;

            int actualDays = weekStartDate_startDate_difference + 1;
            int forecastDays = 7 - weekStartDate_startDate_difference - 1;

            if (weekStartDate_startDate_difference >= 7)
            {
                actualDays = 7;
                forecastDays = 0;
            }
            else if (weekStartDate_startDate_difference == 0)
            {
                actualDays = 1;
                forecastDays = 6;
            }
            else if (weekStartDate_startDate_difference < 0)
            {
                actualDays = 0;
                forecastDays = 7;
            }
            if (actualDays > 7) actualDays = 7;
            if (forecastDays > 7) forecastDays = 7;


            // Generate a dictionary of groups (Brands)
            Dictionary<string, GroupForecastData> groupData = new Dictionary<string, GroupForecastData>();
            InventoryController.itemTableLock.WaitOne();
            foreach (var item in InventoryController.itemTable)
            {
                if (!groupData.ContainsKey(item.brand)) groupData.Add(item.brand, new GroupForecastData(item.brand, 7));
            }
            InventoryController.itemTableLock.ReleaseMutex();

            // Loop over every sale and populate the data in the dictionary - Adding to the running total and count for each day
            SalesController.salesTableLock.WaitOne();
            InventoryController.itemTableLock.WaitOne();
            foreach (var sale in SalesController.salesTable)
            {
                DateTime saleDate;
                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), DateTimeStyles.AssumeLocal, out saleDate))
                {
                    // Get the item from the sale (used to find out the sales brand)
                    InventoryItem item = null;
                    foreach (var compareItem in InventoryController.itemTable)
                    {
                        if (sale.itemID == compareItem.id) item = compareItem;
                    }

                    int dayOfWeek = (int)saleDate.DayOfWeek;
                    groupData[item.brand].forecastRunningTotal[dayOfWeek] += Double.Parse(item.purchasePrice) * sale.quantity;
                    groupData[item.brand].forecastRunningCount[dayOfWeek] += 1;

                }
            }
            InventoryController.itemTableLock.ReleaseMutex();
            SalesController.salesTableLock.ReleaseMutex();

            // Generate a JSON file based off of the data
            string result = "{";
            result += "\"rows\": [";
            foreach (var group in groupData)
            {
                result += "{";
                result += "\"name\":\"" + group.Value.name + "\",";
                result += "\"day\": [ ";

                // Actual Days:
                for (int i = 0; i < actualDays; i++)
                {
                    result += 0 + ",";
                }
                result = result.Remove(result.Length - 1);

                result += "],";
                result += "\"forecast\": [ ";

                // Forecast Days:
                for (int i = actualDays; i < 7; i++)
                {
                    if (group.Value.forecastRunningCount[i] > 0)
                    {
                        result += (group.Value.forecastRunningTotal[i] / group.Value.forecastRunningCount[i]) + ",";
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
            result = result.Remove(result.Length - 1);
            result += "]";
            result += "}";

            return Ok(result);
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
            // startDate - will be any date in the week the forcast will be generated for
            DateTime todayDate;
            DateTime startDate;
            if (!DateTime.TryParse(date, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out startDate)
                || !DateTime.TryParse(today, new CultureInfo("en-AU"), System.Globalization.DateTimeStyles.AssumeLocal, out todayDate))
            {
                // Failed to parse the dates.
                return StatusCode(400);
            }

            // Load Sales & Inventory Controllers (if not already) (for loading the data)
            if (!InventoryController.itemTableLoadedFromFile)
            {
                InventoryController c = new InventoryController();
            }

            if (!SalesController.salesTableLoadedFromFile)
            {
                SalesController sc = new SalesController();
            }

            // 2. Get the date of the start of the month
            int monthStartOffset = (int)startDate.Day;
            DateTime monthStartDate = startDate.AddDays(-monthStartOffset);

            // Get the number of days in the month that have alread passed
            // Get the number of days in the month that will be predicted
            //    (It is possible for the month to be entiraly existing data or entrialy predictions)
            TimeSpan differenceDate = todayDate - monthStartDate;
            int monthStartDate_startDate_difference = differenceDate.Days;
            int monthLength = DateTime.DaysInMonth(startDate.Year, startDate.Month);

            int actualDays = monthStartDate_startDate_difference + 1;
            int forecastDays = 7 - monthStartDate_startDate_difference - 1;

            if (monthStartDate_startDate_difference >= monthLength)
            {
                actualDays = monthLength;
                forecastDays = 0;
            }
            else if (monthStartDate_startDate_difference == 0)
            {
                actualDays = 1;
                forecastDays = monthLength - 1;
            }
            else if (monthStartDate_startDate_difference < 0)
            {
                actualDays = 0;
                forecastDays = monthLength;
            }
            if (actualDays > monthLength) actualDays = monthLength;
            if (forecastDays > monthLength) forecastDays = monthLength;

            // Generate a dictionary of groups (Brands)
            Dictionary<string, GroupForecastData> groupData = new Dictionary<string, GroupForecastData>();
            InventoryController.itemTableLock.WaitOne();
            foreach (var item in InventoryController.itemTable)
            {
                if (!groupData.ContainsKey(item.brand)) groupData.Add(item.brand, new GroupForecastData(item.brand, monthLength));
            }
            InventoryController.itemTableLock.ReleaseMutex();

            // Loop over every sale and populate the data in the dictionary - Adding to the running total and count for each day
            SalesController.salesTableLock.WaitOne();
            InventoryController.itemTableLock.WaitOne();
            foreach (var sale in SalesController.salesTable)
            {
                DateTime saleDate;
                if (DateTime.TryParse(sale.date, new CultureInfo("en-AU"), DateTimeStyles.AssumeLocal, out saleDate))
                {
                    // Get the item from the sale (used to find out the sales brand)
                    InventoryItem item = null;
                    foreach (var compareItem in InventoryController.itemTable)
                    {
                        if (sale.itemID == compareItem.id) item = compareItem;
                    }

                    int dayOfMonth = (int)saleDate.Day - 1;
                    groupData[item.brand].forecastRunningTotal[dayOfMonth] += Double.Parse(item.purchasePrice) * sale.quantity;
                    groupData[item.brand].forecastRunningCount[dayOfMonth] += 1;

                }
            }
            InventoryController.itemTableLock.ReleaseMutex();
            SalesController.salesTableLock.ReleaseMutex();

            // Generate a JSON file based off of the data
            string result = "{";
            result += "\"rows\": [";
            foreach (var group in groupData)
            {
                result += "{";
                result += "\"name\":\"" + group.Value.name + "\",";
                result += "\"day\": [ ";

                // Actual Days:
                for (int i = 0; i < actualDays; i++)
                {
                    result += 0 + ",";
                }
                result = result.Remove(result.Length - 1);

                result += "],";
                result += "\"forecast\": [ ";

                // Forecast Days:
                for (int i = actualDays; i < monthLength; i++)
                {
                    if (group.Value.forecastRunningCount[i] > 0)
                    {
                        result += (group.Value.forecastRunningTotal[i] / group.Value.forecastRunningCount[i]) + ",";
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
            result = result.Remove(result.Length - 1);
            result += "]";
            result += "}";

            return Ok(result);
        }

    }
}

