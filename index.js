const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log("File written!");
*/

/*
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
        console.log(data3);

        fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
            console.log('Your file has been written.')
        })
    });
  });
});
console.log('Reading the file')
*/
////////////////////////////////////////////////
// SERVER


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer ((req, res) => {
    const {query, pathname} = url.parse(req.url, true); //query retorna o ID e pathname /caminho 
        

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml); //Substitui a primeira expressão por todas as Cards
        res.end(output);

    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id]; //produto = pesquisaDataObj no index da query id
        const output = replaceTemplate(tempProduct, product);
        res.end(output);


    } else if (pathname === '/api') {
            res.writeHead(200, {'Content-type': 'application/json'});
            console.log('tamo na api');
            res.end(data);
        
    } else { res.writeHead(404, 
            {
                'Content-type': 'text/html',
                'my-own-header': 'hello-world'
            });
        res.end('<h1>Page not found.</h1>');
    }
});
const port = '3000'
server.listen(port, '127.0.0.1', () => {
    console.log(`Listening to requests on port ${port}`);
});
