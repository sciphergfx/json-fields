// UI Library Adapters
// This file provides adapters for different UI libraries

export const getUIComponents = (uiLibrary = 'chakra') => {
  // All UI libraries use the same HTML elements as base
  // The styling is handled through classes and props
  // eslint-disable-next-line no-unused-vars
  // const _unused = uiLibrary;
  return {
    Container: 'div',
    Box: 'div',
    Button: 'button',
    Input: 'input',
    Select: 'select',
    Textarea: 'textarea',
    Table: 'table',
    Thead: 'thead',
    Tbody: 'tbody',
    Tr: 'tr',
    Th: 'th',
    Td: 'td',
    Text: 'span',
    Heading: 'h2',
    Stack: 'div',
    HStack: 'div',
    VStack: 'div',
    Card: 'div',
    Alert: 'div',
    Badge: 'span',
    Grid: 'div',
    GridItem: 'div',
    Flex: 'div',
    Label: 'label'
  };
};

export const getUIClasses = (uiLibrary = 'chakra', component, variant = 'default') => {
  const classMap = {
    tailwind: {
      Container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      Box: 'block',
      Button: {
        default: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        secondary: 'inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      },
      Input: {
        default: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
        checkbox: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
      },
      Select: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
      Textarea: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical',
      Table: 'min-w-full divide-y divide-gray-200',
      Thead: 'bg-gray-50',
      Tbody: 'bg-white divide-y divide-gray-200',
      Tr: 'hover:bg-gray-50',
      Th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      Td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      Text: 'text-gray-900',
      Heading: 'text-2xl font-bold text-gray-900 mb-4',
      Stack: 'space-y-4',
      HStack: 'flex space-x-4 items-center',
      VStack: 'flex flex-col space-y-4',
      Card: 'bg-white overflow-hidden shadow rounded-lg p-6',
      Alert: {
        error: 'bg-red-50 border border-red-200 rounded-md p-4 text-red-800',
        success: 'bg-green-50 border border-green-200 rounded-md p-4 text-green-800',
        warning: 'bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800',
        info: 'bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800'
      },
      Badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
      Grid: 'grid',
      GridItem: '',
      Flex: 'flex',
      Label: 'block text-sm font-medium text-gray-700'
    },
    shadcn: {
      Container: 'container mx-auto px-4',
      Box: 'block',
      Button: {
        default: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
        secondary: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2'
      },
      Input: {
        default: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checkbox: 'h-4 w-4 rounded border border-primary text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
      },
      Select: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      Textarea: 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      Table: 'w-full caption-bottom text-sm',
      Thead: '[&_tr]:border-b',
      Tbody: '[&_tr:last-child]:border-0',
      Tr: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      Th: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      Td: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
      Text: 'text-sm text-muted-foreground',
      Heading: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      Stack: 'flex flex-col space-y-4',
      HStack: 'flex space-x-4',
      VStack: 'flex flex-col space-y-4',
      Card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
      Alert: {
        error: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
        warning: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
        info: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground'
      },
      Badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      Grid: 'grid',
      GridItem: '',
      Flex: 'flex',
      Label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    }
  };

  if (uiLibrary === 'chakra') {
    return ''; // Chakra UI uses props, not classes
  }

  const libraryClasses = classMap[uiLibrary];
  if (!libraryClasses || !libraryClasses[component]) {
    return '';
  }

  const componentClasses = libraryClasses[component];
  if (typeof componentClasses === 'object') {
    return componentClasses[variant] || componentClasses.default || '';
  }

  return componentClasses;
};
