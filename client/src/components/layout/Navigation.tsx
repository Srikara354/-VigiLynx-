import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Community', href: '/community' },
  { name: 'Cyber News', href: '/news' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings' },
];

export function Navigation() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <Disclosure as="nav" className="bg-white shadow-sm rounded-b-2xl border-b border-gray-100">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-3xl font-semibold text-gray-900 tracking-tight select-none">VigiLynx</Link>
                <div className="hidden sm:flex sm:space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? 'text-gray-900 border-b-2 border-gray-900 bg-gray-50 rounded-t-md shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors',
                        'px-4 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:flex sm:items-center">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="bg-white rounded-full flex text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                        {user?.email?.[0]?.toUpperCase()}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 bg-white ring-1 ring-gray-100 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-4 py-2 text-base text-gray-700 rounded-lg'
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block w-full text-left px-4 py-2 text-base text-gray-700 rounded-lg'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white rounded-b-2xl shadow-md">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                    'block pl-6 pr-4 py-3 text-lg font-medium rounded-md transition-colors'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-100 bg-white rounded-b-2xl">
              <div className="flex items-center px-6">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-lg font-medium text-gray-900">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-6">
                <Disclosure.Button
                  as={Link}
                  to="/profile"
                  className="block px-4 py-2 text-base text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-base text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}