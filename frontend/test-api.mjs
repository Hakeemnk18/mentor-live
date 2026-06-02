import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const testFetch = async () => {
  try {
    const res = await fetch("http://localhost:4005/api/v1/faculties?limit=1");
    const json = await res.json();
    console.log("FACULTY API RESPONSE:");
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(e);
  }
};
testFetch();
