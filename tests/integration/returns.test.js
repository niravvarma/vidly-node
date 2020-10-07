const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let movie;
  let rental;
  let token;
  //const payload = { customerId, movieId };

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    //remove the data after tests run
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  //Just testing if the setup is correct or not
  it('should work', async () => {
    const res = Rental.findById(rental._id).exec();
    expect(res).not.toBeNull();
  });

  it('should return 401 if the user is not logged in', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if the customerID is not provided', async () => {
    customerId = ''; //delete payload.customerId is another approach
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 400 if the movieId is not provided', async () => {
    movieId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for the customer/movie', async () => {
    await Rental.deleteMany({}); //will delete if any rental is set
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date(); // will set the date of returned movie to new date, thus, movie rental is processed
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if valid request', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it('should return the movie returned date if valid request', async () => {
    const res = await exec();
    const rentalInDB = await Rental.findById(rental._id).exec();
    expect(rentalInDB.dateReturned).toBeDefined(); //Too general test
    expect(rentalInDB.dateReturned).not.toBeNull(); //Too general test

    const diff = new Date() - rentalInDB.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should return calculated fee if valid request', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate(); // setting dateOut to be 7 days from current time
    await rental.save();

    const res = await exec();

    const rentalInDB = await Rental.findById(rental._id).exec();
    expect(rentalInDB.dateReturned).toBeDefined();

    expect(rentalInDB.rentalFee).toBe(14); //should be $14 as rentalFee was set to 2
  });

  it('should increase the movie stock if valid request', async () => {
    const res = await exec();
    const movieInDB = await Movie.findById(movieId).exec();
    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return then rental if input is valid request', async () => {
    const res = await exec();
    const rentalInDB = await Rental.findById(rental._id).exec();
    // expect(res.body).toHaveProperty('dateOut');
    // expect(res.body).toHaveProperty('dateReturned');
    // expect(res.body).toHaveProperty('rentalFee');
    // expect(res.body).toHaveProperty('customer');
    // expect(res.body).toHaveProperty('movie');

    // Perhaps, a better approach is following
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie',
      ])
    );
  });
});
