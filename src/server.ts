import { app } from './app';
import { APPDataSource } from './database/data-source';

APPDataSource.initialize().then(() => {
  app.listen(3015, () => console.log('Server is running! 🏆 Open http://localhost:3015/ to see results')
  );
});
