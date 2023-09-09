# Intellisense Connect
## Local Setup
- Open cmd
- Go to your specified directory
- Clone the code
```
git clone https://github.com/serpents22/intellisense-ubs-devicesnet.git
```
- Open code in VSCODE
```
npm install
```
### Compiles and Run code in local
```
npm run serve
```
## Push and Pull a code
- Install Source Control in your VSCODE <br>
![image](https://user-images.githubusercontent.com/63382551/197256874-d1332905-30df-453e-88e4-1a9bd4cac7ca.png)<br>
-All your changes will appear here<br>
![image](https://user-images.githubusercontent.com/63382551/197256945-e60fcd21-e9ce-46a4-9ddd-d385f0ac7e58.png)<br>
-Click plus icon for stage your changes before commiting it<br>
![image](https://user-images.githubusercontent.com/63382551/197257129-14067365-3904-49cf-a3a7-3cf235a0dd98.png)<br>
-Enter your message an click commit<br>
![image](https://user-images.githubusercontent.com/63382551/197257287-324636a7-9811-4b7f-9018-3972d12737fc.png)<br>
-Click more button and click Push to Push your changes<br>
![image](https://user-images.githubusercontent.com/63382551/197257417-f737ef6d-7110-4007-83d7-58a06c923df6.png)<br>
-Done :)





## VPS Setup
- Go to code directory ```cd dev/intellisense-ubs-devicesnet```
- ``` git pull ```

### Remove Existing Container and Images
this command below can be executed in any directory
```
docker rm -f intellisense-ubs-devicesnet
```

```
docker rmi intellisense-ubs-devicesnet:latest
```

### Create new Images and Run a Container
execute this command inside code directory
```
docker build -t intellisense-ubs-devicesnet .
```

```
docker run -p 8080:80 -d --name intellisense-ubs-devicesnet intellisense-ubs-devicesnet
```


https://cli.vuejs.org/guide/deployment.html#docker-nginx
