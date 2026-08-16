def printinfo(name, age=35):  # Function with a default parameter
    print("name", name)
    print("age", age)
    return  # Optional, as Python functions return None by default

printinfo(age=60, name="maya")  # Function call with keyword arguments
