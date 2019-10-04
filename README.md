# Mongo Scraper

![Screenshot](/public/assets/images/screenshot.png)

## NPM dependencies:

- Express
- Express-handlebars
- Body-parser
- Morgan (logger)
- Mongoose
- Method-override
- Request
- Cheerio

## MVC folder structure:

![Screenshot](/public/assets/images/folder-breakdown.png)

### Model

In my Model I have the Article, Index and Note files. These files all create the structure for my data logic and rules for my project.

### View

In my View I broken it into a main page that pulls the images and css styling from a public file.

### Controller

A controller responds to the user input and performs interactions on the data model objects. The routes receives the input, optionally validates it and then passes the input to the model. Which is acting as my controller.
