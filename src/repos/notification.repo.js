const client = require("../dbs/init.postgres.lv0");

class NotificationRepo {
  createOne = async (notiId, receivedId) => {
    //status = 0 : chua xem
    const query = {
      text: "insert into noti_received (noti_id, received_id, status) values ($1, $2, $3) returning noti_receivedid",
      values: [notiId, receivedId, 0],
    };
    const newNoti = (await client.query(query)).rows[0].noti_receivedid;
    return newNoti;
  };

  findOne = async (notiId) => {
    const query = {
      text: "select * from notifications n inner join noti_types nt on n.noti_typeid = nt.noti_typeid where noti_id = $1;",
      values: [notiId],
    };
    const foundNoti = (await client.query(query)).rows[0];
    console.log("foundNoti:::", foundNoti);
    return foundNoti;
  };
}

module.exports = new NotificationRepo();
