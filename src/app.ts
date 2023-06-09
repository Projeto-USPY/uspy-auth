import { Request, Response } from 'express';
import { fetchPDF } from './fetcher';

import { initialize } from './browser';
import { HttpFunction } from '@google-cloud/functions-framework';

export const handle: HttpFunction = async (req: Request, res: Response) => {
  if (!req.params || !req.params['0'] || !req.params['0'].length) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(400).send('Missing params');
    return;
  }

  const code = req.params['0'];

  const browser = await initialize();
  await fetchPDF(browser, code)
    .then((buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).send(buffer);
    })
    .catch((e) => {
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send(e.message);
    });
};
