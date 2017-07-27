const Sequelize = require('sequelize'),
    config = require('./../config');

// this is for deployment in heroku
if (process.env.DATABASE_URL) {

    var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    var connection = new Sequelize(match[5], match[1], match[2], {
        dialect: 'postgres',
        protocol: 'postgres',
        port: match[4],
        host: match[3],
        logging: false,
        dialectOptions: {
            ssl: true
        }
    });

} else {
    var connection = new Sequelize(config.database.name, config.database.username,
        config.database.password, config.database.config);
}

var Movies = connection.import(__dirname + '/movies.js');
var User = connection.import(__dirname + '/user.js');
var Post = connection.import(__dirname + '/post.js');
var Hashtag = connection.import(__dirname + '/hashtag.js');
var HashtagPost = connection.import(__dirname + '/hashtag_post.js');
var Sponsor = connection.import(__dirname + '/sponsor.js');
var Category = connection.import(__dirname + '/category.js');
var Session = connection.import(__dirname + '/session.js');
var CategorySession = connection.import(__dirname + '/category_session.js');

// if there's any relations put it here
// Users.hasMany(Movies);
// Movies.belongsTo(Users);
User.hasMany(Post);
Post.belongsTo(User);

Category.belongsToMany(Session, { through: CategorySession, constraints: false });
Session.belongsToMany(Category, { through: CategorySession, constraints: false });

Post.belongsToMany(Hashtag, {
    through: {
        model: HashtagPost,
        unique: false
    },
    foreignKey: 'postId',
    constraints: false
});

Hashtag.belongsToMany(Post, {
    through: {
        model: HashtagPost,
        unique: false
    },
    foreignKey: 'tagId',
    constraints: false
});

// setup the array of modules
var modules = {
    connection: connection,
    movies: Movies,
    user: User,
    post: Post,
    hashtag: Hashtag,
    sponsor: Sponsor,
    category: Category,
    session: Session,
    catses: CategorySession
};

module.exports = function (name) {
    return modules[name];
};