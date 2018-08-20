const Validator = require('jsonschema').Validator;
const UserValidator = new Validator();

// pattern matching
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
const longLatRegex = /^-?\d{1,3}(.\d*)?$/m;
const timeOffsetRegex = /^-?\d{1,2}:\d{2}$/m
// the random user api has 8 digit phone numbers
// we are using a very simple validation of 1 or more digits, requirement unknown
const phoneRegex = /^\d+$/m;


// User Schema
const userSchema = {
  type: 'object',
  properties: {
    gender: {
      enum: ['male', 'female'],
      required: true
    },
    name: {
      type: 'object',
      required: true,
      properties: {
        title: {
          required: true,
          type: 'string'
        },
        first: {
          type: 'string',
          required: true,
          minLength: 1
        },
        last: {
          type: 'string',
          required: true,
          minLength: 1
        }
      }
    },
    location: {
      type: 'object',
      required: true,
      properties: {
        street: {
          type: 'string',
          required: true,
          minLength: 1,
        },
        city: {
          type: 'string',
          required: true,
          minLength: 1
        },
        state: {
          type: 'string',
          required: true,
          minLength: 1
        },
        postcode: {
          type: 'string',
          required: true,
        },
        coordinates: {
          type: 'object',
          required: true,
          properties: {
            latitude: {
              type: 'string',
              required: true,
              pattern: longLatRegex
            },
            longitude: {
              type: 'string',
              required: true,
              pattern: longLatRegex
            }
          }
        },
        timezone: {
          type: 'object',
          required: true,
          properties: {
            offset: {
              type: 'string',
              requried: true,
              pattern: timeOffsetRegex
            },
            description: {
              type: 'string',
              required: true
            }
          }
        }
      },
    },
    email: {
      type: 'string',
      required: true,
      pattern: emailRegex
    },
    login: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
          required: true
        },
        username: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        },
        salt: {
          type: 'string',
          required: true
        },
        md5: {
          type: 'string',
          required: true
        },
        sha1: {
          type: 'string',
          required: true
        },
        sha256: {
          type: 'string',
          required: true
        }
      }
    },
    dob: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date-time',
          required: true
        },
        age: {
          type: 'number',
          required: true
        }
      }
    },
    registered: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date-time',
          required: true
        },
        age: {
          type: 'number',
          required: true
        }
      }
    },
    phone: {
      type: 'string',
      required: true,
      pattern: phoneRegex
    },
    cell: {
      type: 'string',
      required: true,
      pattern: phoneRegex
    },
    id: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          required: true
        },
        value: {
          type: 'string',
          required: true
        },
      }
    },
    picture: {
      type: 'object',
      properties: {
        large: {
          type: 'string',
          pattern: urlRegex
        },
        medium: {
          type: 'string',
          pattern: urlRegex
        },
        thumbnail: {
          type: 'string',
          pattern: urlRegex
        }
      }
    },
    nat: {
      type: 'string',
      required: true
    }
  }
};


const validationErrors = (user) => {
  const { errors } = UserValidator.validate(user, userSchema)
  return errors.map(err => err.stack);
}

module.exports = {
  validationErrors
};
