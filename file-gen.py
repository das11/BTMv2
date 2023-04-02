from bs4 import BeautifulSoup
import requests
from pprint import pprint

url = "https://bodhitreemultimedia.com/about/investors.html"

html = requests.get(url).text
soup = BeautifulSoup(html, "html.parser")

data = {}
filenames = []
filepaths = []

name_object = soup.find_all(class_="coh-column p-0 heading leader-name coh-visible-xs coh-col-xs-8 coh-col-md")
# if len(object) == 0:
#     print("No Elements are found under this class name")
# else:
#     print(object,sep="\n")

for tag in name_object:
    p = tag.find("p")
    if p:
        print("\nTag text : ", p.text)
        filenames.append((' '.join(p.text.split())).replace("\n", ""))

address_object = soup.find_all(class_="coh-wysiwyg d-none description")
for tag in address_object:
    a = tag.find("a")
    if a:
        print("\nTag URL : ", a.get("href"))
        filepaths.append((' '.join(a.get("href").split()).replace("\n","")))

data = dict(zip(filenames, filepaths))
# pprint(data)

print(len(filepaths))

i = 0
str = []
for name in filenames:
    str.append("<div id=\"w-node-bece8a54-44bd-2aec-ff2e-5026fee5cc5f-e1746a35\" role=\"listitem\" class=\"w-dyn-item\"><a href=\"{path}\" class=\"blog-card w-inline-block\" style=\"height: auto; border-color: white;\"> <div class=\"blog-card-top\"><div><h2 class=\"text-display-4\">{name}</h2><h4 class=\"text-display-5\">DOCUMENT</h4></div></div></a></div>".format(path=filepaths[i], name=name))
    i = i + 1

print("REPLACED\n\n\n" + " ".join(str))
