import os
import re
import tempfile
from dotenv import load_dotenv

def create_filled_service_account(template_path: str) -> str:
    load_dotenv()

    with open(template_path, 'r') as f:
        template = f.read()

    def replace_env(match):
        var_name = match.group(1)
        value = os.getenv(var_name)
        if value is None:
            raise ValueError(f"Environment value '{var_name}' not found")
        return value

    filled_content = re.sub(r'\$\{(\w+)\}', replace_env, template)

    temp = tempfile.NamedTemporaryFile(delete=False, mode='w', suffix='.json')
    temp.write(filled_content)
    temp.close()

    return temp.name