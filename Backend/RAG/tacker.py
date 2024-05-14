import json
import shutil
import uuid


def _generate_file_name():
    return str(uuid.uuid4())


def save_new_file(username, base_db_url):
    # Generate a new unique file name
    new_file_name = _generate_file_name()
    with open("tracker.json", "r") as file:
        data = json.load(file)

    # Update file name of the user
    if username in data:
        shutil.rmtree((base_db_url+"/"+data[username]))
        data[username] = new_file_name
    else:
        data[username] = new_file_name

    # Save updated data to file
    with open("tracker.json", "w") as file:
        file.write(json.dumps(data))

    return new_file_name


def get_directory_name(username):
    with open("tracker.json", "r") as file:
        data = json.load(file)
        try:
            return data[username]
        except Exception as e:
            print(e)
