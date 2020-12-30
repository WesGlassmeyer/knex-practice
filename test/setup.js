const { expect } = require("chai");
require("dotenv").config();

const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;
