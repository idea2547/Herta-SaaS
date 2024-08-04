// Importing necessary types from the crypto module
declare const crypto: Crypto;

// Function to generate random bytes
const randomBytes = (length: number): Uint8Array => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

// Function to serialize non-plain-old JavaScript objects
export const serializeNonPOJOs = <T>(obj: T): T => {
  return structuredClone(obj);
};

// Function to generate a username
export const generateUsername = (name: string): string => {
  // Generating a 2-byte random id
  const id = Array.from(randomBytes(2))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `${name.slice(0, 6)}${id}`;
};

// Function to generate a password
export const generatePassword = (): string => {
  const passwordLength = 8;
  const characters = '0123456789zxcvbnmasdfghjklqwertyuiop';
  let password = '';

  const randomArray = randomBytes(passwordLength);
  randomArray.forEach((byte) => {
    const randomIndex = byte % characters.length;
    password += characters.charAt(randomIndex);
  });

  return password;
};

// Function to get an image URL
export const getImageURL = (
  collectionId: string,
  recordId: string,
  fileName: string,
  size: string = '0x0'
): string => {
  return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

// Define a type for the validation result
interface ValidationResult<T> {
  formData: T;
  errors: null | { [key: string]: any };
}

// Function to validate data against a schema
export const validateData = async <T>(
  formData: FormData,
  schema: { parse: (body: any) => T; flatten: () => { [key: string]: any } }
): Promise<ValidationResult<T>> => {
  const body = Object.fromEntries(formData) as T;

  try {
    const data = schema.parse(body);
    return {
      formData: data,
      errors: null,
    };
  } catch (err: any) {
    console.log('Error: ', err);
    const errors = err.flatten();
    return {
      formData: body,
      errors,
    };
  }
};
