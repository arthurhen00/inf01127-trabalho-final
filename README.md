# inf01127-trabalho-final  

## Server
create the .env file in the ./server directory with the following content
```
DATABASE_URL="file:./dev.db"
```
run in terminal:  
```
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```


## Client
run in terminal:  
```
cd web
npm install
npm run dev
```