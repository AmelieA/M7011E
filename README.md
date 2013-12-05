Project for the course M7011E: Design of Dynamic Web Systems at LTU

##Installing everything

to install node.js : http://nodejs.org/.

to download everything with git : sudo git clone git://github.com/AmelieA/M7011E.git.

to install dependencies : npm install.

to install postgreSQL-9.2 : sudo apt-get install postgresql-9.2. If you can't install this version, see "Issues with ubuntu 13.04 and above".

to set-up the database : sudo -u postgres createuser nodetest; sudo -u postgres createdb -O nodetest dbtest; sudo -u postgres dropdb dbtest.

to set-up tables : ./reinitDB ; node createTables.js.

to see the content of the database : node checkTables.js.

to launch the server : node app.

to go to the map locally : http://localhost:8080/mapbox.

to see the demo : http://ec2-54-194-9-139.eu-west-1.compute.amazonaws.com:8080/.



## Issues with ubuntu 13.04 and above

postgreSQL-9.2 is not officialy supported on ubuntu 13.4. You can follow this link to force install it. https://wiki.postgresql.org/wiki/Apt. The distribution codename you will put is "precise".
