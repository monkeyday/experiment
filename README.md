# monkeyday's experiment project about showing open data of agriculture and others

[http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx](http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx)

This application is to retrieve open data of agriculture and display them in a table with sorting, searching and pagination. There are over 4 sources of open data from different origin. Some are **JSON** and some are **XLS** file. Considering saving resource of http request, data retrieved will be saved as local side JavaScript object variables. With the use of NoSQL mapping and reducing, data represented by JavaScript objects composes a NoSQL-like data structure. Graphs are generated based on local side JavaScript objects. It is possible to generate a graph to compare yearly price transition of a certain fruits. Combine the pricing data of various markets and forecast information, we are able to observe the relationship between weather and agriculture goods.

First of all I define the structure of local side JavaScript object. *C1*, *C2*, *C3* represent data origin and 2 levels of its categories. There is a isolated product object generated from open data retrieved. It records information by products. Is there possibility to directly show open data without server side processing? Just provide a site to represent open data from government? With easy use interface and functionality for people to get meaningful information. To display friendly graphs to reveal the meaning of data.

### So the core concept of the application is table and graph of open data.

server.js is a server program to process open data and provide processed data to client. It generates the front end HTML content as response to client.

There are several parts need to be defined. How to define the code structure of different sources of data? There are some common features about code, ex. name, id, pid. The first level of code should be the data source. Front end table should take different source of data and generate result rows. So the question is that different sources of data should be combined into one object or stay isolated objects? 

Originally a CSV file of codes was processed to an object. And a XLS file of CPI was processed and provided as source data. 

The menu item content should be moved to a external file rather than inside server processing file. And make it clearly about how to organize the dropdown menu item. 

One thing confusing is that open data should be saved to NoSQL database or not. The application is expected to work isolated.

Decide the steps of code reforming. Some old codes can be reused.

1. Display open data of agriculture without server processing.

2. Split the code of retrieving category codes from website to different program.

3. Define the format of query string. In what situation the query string should be appended default date or other necessary information.

4. Different sources of open data has various date format. There should be a function to deal with various kinds of date format and unify them to only one format.

5.



| Item | Value |
| -------- | -------- |
| Computer | 1600 USD |
| Phone | 12 USD |
| Pipe | 1 USD |

