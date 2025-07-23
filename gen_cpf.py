import random

def generate_cpf(format_output=True):
    # Generate the first 9 digits randomly
    cpf = [random.randint(0, 9) for _ in range(9)]

    # Calculate first check digit
    sum1 = sum((10 - i) * cpf[i] for i in range(9))
    d1 = (sum1 * 10) % 11
    d1 = 0 if d1 == 10 or d1 == 11 else d1
    cpf.append(d1)

    # Calculate second check digit
    sum2 = sum((11 - i) * cpf[i] for i in range(10))
    d2 = (sum2 * 10) % 11
    d2 = 0 if d2 == 10 or d2 == 11 else d2
    cpf.append(d2)

    # Format output
    if format_output:
        return f"{cpf[0]}{cpf[1]}{cpf[2]}.{cpf[3]}{cpf[4]}{cpf[5]}.{cpf[6]}{cpf[7]}{cpf[8]}-{cpf[9]}{cpf[10]}"
    else:
        return ''.join(map(str, cpf))

# Generate and print a formatted CPF
print(generate_cpf())
