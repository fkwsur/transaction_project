- 프로젝트 실행
1. 프로젝트를 클론받거나 다운받습니다.
2. 터미널을 실행한 후 프로젝트 루트 경로로 이동합니다.
3. 도커가 설치되어있지 않다면 설치합니다.
4. docker-compose up 명령어를 입력합니다. (맥북일 경우 sudo docker-compose up) 
5. 프로젝트가 켜질때까지 기다립니다. (도커 데스크톱에서 컨테이너에 초록불이 들어오거나 명령어 docker-compose ps 를 입력했을때 컨테이너 State가 up 상태여야 합니다.)

- API 테스트
1. (POST /api/v1/accounting/process) 테스트 예시
    - value값의 파일 경로를 맞춰주셔야 합니다.

```powershell
curl -X POST http://localhost:8081/api/v1/accounting/process \
  -F "bank_transactions=@bank_transactions.csv" \
  -F "rules=@rules.json"
```

1. **(GET /api/v1/accounting/records?companyId=...)** 테스트 예시

```powershell
curl "http://localhost:8081/api/v1/accounting/records?companyId=com_1"
```