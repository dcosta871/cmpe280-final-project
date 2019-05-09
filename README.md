<h1>TO RUN WEB SERVER LOCALLY: </h1>

run db: create db called rides_app_db and in that create collection parks. Import parks.json into this collection. From any directory, run "mongod --config /usr/local/etc/mongod.conf"  
  
run flask: cd into server, run "FLASK_APP=server.py flask run"  
  
run web app: cd into map-app, run "npm install" then run "ng serve"  


<h1>TO RUN MACHINE LEARNING (note: Not needed, pickle files already included in server. Only to show generation of XGB pickle models): </h1>

1. Either use Jupyter notebook (install python library first) to view code implementation/run details OR run python standalone script to generate pickle models.

2. Requires XGB library installation + other basic ML libraries, must have GPU processing power, takes a while to run as many data rows/columns.


<h1> Website: http://ec2-54-201-84-148.us-west-2.compute.amazonaws.com/ </h1>
