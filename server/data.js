import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'user',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      title: 'Lorem',
      author: 'Lorem',
      description: 'asdasdas',
      category: 'test',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120000,
      publishDate: "2022-12-09T00:00:00.000+00:00",
      pageCount: "1",
      countInStock: 1,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '2',
      title: 'Lorem',
      author: 'Lorem',
      description: 'asdasdas',
      category: 'test',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120000,
      publishDate: "2022-12-09T00:00:00.000+00:00",
      pageCount: "1",
      countInStock: 1,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '3',
      title: 'Lorem',
      author: 'Lorem',
      description: 'asdasdas',
      category: 'test',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120000,
      publishDate: "2022-12-09T00:00:00.000+00:00",
      pageCount: "1",
      countInStock: 1,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '4',
      title: 'Lorem',
      author: 'Lorem',
      description: 'asdasdas',
      category: 'test',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120000,
      publishDate: "2022-12-09T00:00:00.000+00:00",
      pageCount: "1",
      countInStock: 1,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
  ],
};
export default data;
