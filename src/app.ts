import { Request, Response } from 'express';
import { fetchPDF } from './fetcher';

import { HttpFunction } from '@google-cloud/functions-framework';

import { Browser } from 'puppeteer';

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const initialize = async () => {
  return puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process' // <- this one doesn't works in Windows
    ]
  });
};

export const handle: HttpFunction = async (req: Request, res: Response) => {
  if (!req.params || !req.params['0'] || !req.params['0'].length) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(400).send('Missing params');
    return;
  }

  const browser = await initialize();

  const code = req.params['0'];

  await fetchPDF(browser, code)
    .then(async (response) => {
      if (!response.buffer) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(500).send('No buffer');
        return;
      }

      const buffer = await response.buffer;
      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).send(buffer);
    })
    .catch(async (response) => {
      console.log(response);
      if (response.err === 'invalid_code') {
        res.setHeader('Content-Type', 'text/plain');
        res.status(400).send('Invalid code');
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.status(500).send(response.err);
      }
    });

  await browser.close();
};
