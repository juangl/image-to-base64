#!/usr/bin/env node

var fsp = require('fs-promise');
var fs = require('fs');
var Promise = require('any-promise');
var path = require('path');

var dirname = path.resolve(__dirname, '../images/');
var writeTo = path.resolve(__dirname, '../', 'images.json');

var ext = /.(jpg|png|gif)$/;

function convertToBase64(filename) {
    return fsp.readFile(path.resolve(dirname, filename), 'base64').then(
      function(data) {
        return { filename: filename, data: data };
      });
}

fs.readdir(dirname, function(err, filenames) {
  if (err) {
    console.log(err);
  }
  var imagesData = {};


  var actions = filenames.filter(
    function(filename) {
      
      return ext.test(filename);
    }
  ).map(convertToBase64);

  var runAll = Promise.all(actions);

  runAll.then(function(data) {
    var dataObj = {};
    data.forEach(function(imgData) {
      dataObj[imgData.filename] = imgData.data;
    });

    fsp.outputJson(writeTo, dataObj).then(function() {
      console.log('File successful wrote!');
    }).catch(function(err) {
      console.log(err);
    });

  }).catch(function(err) {
    console.log(err);
  });
});
