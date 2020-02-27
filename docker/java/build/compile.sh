#!/bin/bash
cd src
ant clean
ant compile
ant jar
ant run

#java -jar /src/bin/jar/Main.jar
