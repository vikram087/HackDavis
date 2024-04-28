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