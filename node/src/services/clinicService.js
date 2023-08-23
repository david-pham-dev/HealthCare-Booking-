const db = require('../models');
let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionMarkDown ||
        !data.descriptionHTML ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          data: 'Missing Parameters',
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkDown: data.descriptionMarkDown,
        });
      }
      resolve({
        errCode: 0,
        errMessage: 'ok',
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, 'base64').toString('binary');
          return item;
        });
      }
      resolve({
        errMessage: 'ok',
        errCode: 0,
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          data: 'Missing Parameters',
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: inputId,
          },
          attributes: ['descriptionHTML', 'descriptionMarkDown'],
        });
        if (data) {
          let doctorClinic = [];
          doctorClinic = await db.Doctor_Infor.findAll({
            where: {
              clinicId: inputId,
            },
            attributes: ['doctorId', 'provinceId'],
          });
          data.doctorClinic = doctorClinic;
        } else data = {};

        resolve({
          errMessage: 'ok',
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
};