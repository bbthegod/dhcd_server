import httpStatus from 'http-status';
import path from 'path';
import File from './model';

export async function load(req, res, next, id) {
  const fileUploaded = await File.findById(id);
  if (!fileUploaded) return res.status(httpStatus.NOT_FOUND).end();
  req.fileUploaded = fileUploaded;
  return next();
}

export function get(req, res) {
  return res.json(req.fileUploaded);
}

export async function create(req, res) {
  const file = new File({ url: '/' + req.file.originalname, filename: req.body.filename, allowDelegate: req.body.allowDelegate });
  file.save();
  return res.json(file);
}

export function update(req, res) {
  const { filename, allowDelegate } = req.body;
  const { fileUploaded, file } = req;
  fileUploaded.filename = filename;
  fileUploaded.allowDelegate = allowDelegate;
  if (file) {
    fileUploaded.url = '/' + file.originalname;
  }
  fileUploaded.save();
  return res.json(fileUploaded);
}

export async function list(req, res) {
  const { auth } = req;
  let { limit = 50, skip = 0, filter, sort } = req.query;
  if (auth.role === "delegate") {
    filter = { "allowDelegate" : true };
  }
  const files = await File.List({ limit, skip, filter, sort });
  return res.json(files);
}

export function remove(req, res) {
  const { fileUploaded } = req;
  fileUploaded.remove();
  return res.json(fileUploaded);
}