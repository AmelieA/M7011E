Project for the course M7011E: Design of Dynamic Web Systems at LTU

##Installing everything

to install node.js : http://nodejs.org/.

to download everything with git : sudo git clone git://github.com/AmelieA/M7011E.git.

to install dependencies : npm install.

to install postgreSQL-9.2 : sudo apt-get install postgresql-9.2. If you can't install this version, see "Issues with ubuntu 13.04 and above".

to set-up tables : sudo -u postgres createuser nodetest; sudo -u postgres createdb -O nodetest dbtest; sudo -u postgres dropdb dbtest.

to launch the server : node app.

to go to the map locally : http://localhost:8080/mapbox.

to see the demo : http://54.194.9.139:8080/mapbox.



## Issues with ubuntu 13.04 and above

postgreSQL-9.2 is not officialy supported on ubuntu 13.4. You can follow this link to force install it. https://wiki.postgresql.org/wiki/Apt. The distribution codename you will put is "precise".
