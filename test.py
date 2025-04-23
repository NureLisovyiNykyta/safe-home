import json

with open("google-services.json") as f:
    creds = json.load(f)

print(f'GOOGLE_CREDENTIALS="{json.dumps(creds).replace(chr(92), chr(92) * 2)}"')