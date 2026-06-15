const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async event => {
  const { tableNo } = event;
  if (!tableNo) throw new Error('tableNo is required');

  const qrContent = `tableNo=${encodeURIComponent(tableNo)}`;
  await cloud.database().collection('tables').where({ tableNo }).update({
    data: {
      qrCode: qrContent,
      status: true
    }
  });

  return {
    success: true,
    tableNo,
    qrCode: qrContent
  };
};
