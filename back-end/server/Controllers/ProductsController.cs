using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace server.Controllers
{
    // TODO: Database Connections

    public class ProductsController : ApiController
    {
        // Products
        Product[] products = new Product[]
        {
            new Product { Id = 1, Name = "Road Bike", Description = "An ordanary bike.", SKU = "AAA-AAA-AA", Cost = 10.00, Retail = 20.00, Quantity = 3 }
        };

        // Web API
        public IEnumerable<Product> GetAllProducts()
        {
            // TODO: Return all entries in the database.
            return products;
        }

        public IHttpActionResult GetProduct (int id)
        {
            var product = products.FirstOrDefault((p) => p.Id == id);
            if (product == null)
                return NotFound();
            return Ok(product);
        }
    }
}
