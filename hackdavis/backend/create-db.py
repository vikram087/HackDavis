from elasticsearch import Elasticsearch

client = Elasticsearch("http://localhost:9200")

# users, allergies
def createNewIndex(name, delete):
    if client.indices.exists(index=name) and delete:
        client.indices.delete(index=name)
    if not client.indices.exists(index=name):
        client.indices.create(
            index=name, 
            mappings={
                'properties': {
                    'embedding': {
                        'type': 'dense_vector',
                    },
                },
            },
        )
    else:
        print("Index already exists and no deletion specified")
        
# createNewIndex("allergies", False)
# createNewIndex("users", False)

def addMockData():
    # user: a47abc25-8747-4dbc-bcfa-9ad21c165269
    # pastScans: [0123456, 34897579, 8349587, 3048530]