module.exports = {
  async up(db, client) {
    const adminUser = [
      {
        _id: 'adm::182d537d-87e1-4aae-98e7-8a5b46e94e11',
        email: 'admin.h@gmail.com',
        role: ['ADMIN'],
        // qwerty
        password:
          '$2b$10$IuRnJ72BZ1NsfbRDgU5QVuZzaznQHGPmxCfVCZMkckdrAmBbi3Pxq',
      },
      {
        _id: 'adm::debug',
        email: 'debug@huntengo.com',
        role: ['ADMIN'],
        // qwerty
        password:
          '$2b$10$IuRnJ72BZ1NsfbRDgU5QVuZzaznQHGPmxCfVCZMkckdrAmBbi3Pxq',
      },
    ];
    await db.collection('admins').insertMany(adminUser);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
