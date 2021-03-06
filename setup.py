from setuptools import setup, find_packages


setup(
    name='django-osme',
    version=__import__('osme').__version__,
    packages=find_packages(),
    zip_safe=False,
    install_requires=[
        'Django>=1.9.8',
        'requests>=2.23.0',
        'jsonfield>=2.1.1',
    ],
    package_data={
        'osme': [
            'locale/*/LC_MESSAGES/*',
            'static/osme/*',
        ],
    },
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Framework :: Django',
    ]
)
