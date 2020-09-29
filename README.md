## Vidly - a Node.js application (SEP 2020)

This repo contains application which runs an imaginary video rental nodejs application with Express for handling middleware, MongoDB Atlas for db and deployment on Heroku. Purpose of this application was to learn NodeJS not an actual application to be used for production.

**NOTE**: This project was developed by learning NodeJS tutorial from Mosh Hamedani - https://codewithmosh.com/p/the-complete-node-js-course. You can find the original repository here: https://github.com/mosh-hamedani/vidly-api-node

I did not forked the original repository because I had little different setup that included different versions of some node modules (check package.json) and have used MongoDB Atlas (https://www.mongodb.com/cloud/atlas) which is a cloud offering rather than installing MongoDB which was little headache to install.

## Software and Versions

Following are lists of softwares and their version which I used to develop the application.

|    Software     |         Version          |
| :-------------: | :----------------------: |
|      node       |          8.17.0          |
|       npm       |          6.13.4          |
|  MongoDB Atlas  |          4.2.9           |
| MongoDB Compass |          1.22.1          |
|       OS        | macOS Big Sur v11.0 beta |
|       IDE       |      VS Code 1.49.2      |
|     Iterm2      |          3.3.12          |

- Theme for VS Code: Ayu Mirage - https://marketplace.visualstudio.com/items?itemName=teabyii.ayu
- File Icon Theme for VS Code: Material Icon - https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme
- Theme for Iterm2: agnoster - https://ethanschoonover.com/solarized/

## Setup

Follow the same steps which Mosh has mentioned on his repo. I am including the steps which I have configured for my repo which is different from the original.

### MongoDB

I used free version of MongoDB cloud offering - Atlas. You can also create a free account: https://www.mongodb.com/cloud/atlas. For checking the data on MongoDB database, I used MongoDB Compass: https://www.mongodb.com/products/compass

1. After creating free account, just create a new cluster. My configuration: 512 MB storage, AWS N. Virginia (us-east-1) and MongoDB 4.2 with no backup. Opt for free version whichever is available (your version may vary)
2. Under Security > Network Access, provide your public IP address
3. Under Security > Database Access, create a new database user and password. For password, provide only alphanumeric. Don't provide any special characters because when I tried to connect, I faced some issues.
4. Under Data Storage > Clusters, click on CONNECT and select 'Connect using MongoDB Compass', choose version: 1.12 or later and copy the connection string in order to connect to MongoDB using Compass.

Your DB setup should be complete now with cluster setup and Compass to check the data in DB.

### Install the Dependencies, populate DB, run tests and starting server

Follow Mosh: https://github.com/mosh-hamedani/vidly-api-node/blob/master/readme.md#install-the-dependencies

### Environment Variables

As I used MongoDB Atlas, I provided a few more details for connection with MongoDB. If you run this application on your mac, the environment details should be set on the command line before running the application. For that, I have created a local folder and added 2 files: prodenv.sh and testenv.sh. I have added all the properties which are required for the project.

These properties are explained below.

1. **vidly_jwtPrivateKey** - set a random text for e.g. "mySecretKey"
2. **vidly_dbUser** - your MongoDB Atlas cluster DB user which you created
3. **vidly_dbPass** - your MongoDB Atlas cluster DB password which you created
4. **vidly_dbName** - MongoDB Collection name
5. **vidly_dbCluster** - This was little tricky. When I tried to connect using details provided in 'Under Data Storage > Clusters' with version 1.12 or later, the application failed. After a little research, I found that in order to connect with Mongoose (which connects Node application to MongoDB), I had to select the version 1.11 or earlier from 'Under Data Storage > Clusters' and then use that value. Here you would need to provide value like this --> "@node-cluster-shard-00-00.pcqog.mongodb.net:27017,node-cluster-shard-00-01.pcqog.mongodb.net:27017,node-cluster-shard-00-02.pcqog.mongodb.net:27017/"
6. **vidly_dbParams** - Again, with the version which I selected, there were extra params, so I provided them. Value which I provided was like this ---> "?replicaSet=atlas-7azcqz-shard-0&ssl=true&authSource=admin"

I have included both files: **prodenv.sh** and **testenv.sh** under local folder but you will have to add your own DB properties. Before you run the application, add your properties and simply run the following command on terminal:

> source prodenv.sh

Once properties are set, you can test your application using Postman.

**Note**: In order to test the application deployed on Heroku, there are few more steps which you need to take care of which are different from the original project.

1. You will need to provide all the properties either manually or via heroku-cli so that there are visible under Settings > 'Config Vars' in Heroku application console.
2. As I used MongoDB Atlas, application will not run with Heroku because under Security in MongoDB Atlas, IP address is not whitelisted of the server where application is deployed on Heroku. And with free version, I guess it is not easy to find the public IP address of the Heroku's pod server. So I allowed all the IPs (0.0.0.0/0) in MongoDB (Security > Network Access) in order to test the application deployed on Heroku.

### Conclusion

It was an awesome experience learning NodeJS application with the Mosh's tutorial. Hats-off to him for making good quality lecturs and upto the point. His step-by-step guide made learning very easy. I recommend Mosh's course for NodeJS to all of you whoever is interested in learning NodeJS.

### Further Development

This project was developed by installing nearly same modules and software as recommended in the course but still there were some deviations. I have also added some learnings in the files as commenst so I hope that you don't get irritated.
Next, I am going to install the latest softwares and modules and will try to achieve the same application using the latest installations.
