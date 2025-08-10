/**
 * Sample JSON data for demonstration
 */

export const SAMPLE_JSON = {
  simple: {
    name: "Simple Object",
    data: {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true
    }
  },
  
  nested: {
    name: "Nested Object",
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      age: 28,
      isActive: true,
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
        country: "USA"
      },
      preferences: {
        newsletter: true,
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    }
  },
  
  complex: {
    name: "Complex Data",
    data: {
      user: {
        id: 1,
        personalInfo: {
          firstName: "Robert",
          lastName: "Johnson",
          dateOfBirth: "1990-05-15",
          email: "robert@company.com",
          phone: "+1-555-0123"
        },
        employment: {
          company: "Tech Corp",
          position: "Senior Developer",
          department: "Engineering",
          startDate: "2020-01-15",
          salary: 95000,
          isFullTime: true
        },
        address: {
          home: {
            street: "456 Oak Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102"
          },
          work: {
            street: "789 Tech Blvd",
            city: "San Francisco",
            state: "CA",
            zipCode: "94103"
          }
        }
      }
    }
  },
  
  array: {
    name: "Array Data",
    data: {
      name: "Product List",
      items: ["Item 1", "Item 2", "Item 3"],
      tags: ["javascript", "react", "web"],
      count: 3
    }
  }
};

export const DEFAULT_JSON = JSON.stringify(SAMPLE_JSON.nested.data, null, 2);
