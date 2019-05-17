'''
NOTE: This class does not seem useful at the moment due to the the webscraper being able to send data straight to 
the SQL server, but I will keep the file here for now.
'''
#Consider this my 'Node' class, in the future we'll have to deal with having many many attributes..
class Player:
    def __init__(self, name, salary, age):
        self._name = name
        self._salary = salary
        self._age = age
        self._next = None

    #Used the property decorator instead of traditional getters and setters! Hear it's more 'pythonic'
    @property
    def next_node(self):
        return self._next

    @next_node.setter
    def next_node(self, new_next):
        self._next = new_next

    '''
    TODO: Have to decide what to do for data attributes as
    I will have a lot of different attributes...
    '''
#Consider this my 'LinkedList'
class Playerbase:
    def __init__(self):
        self.head = None

    def insert(self, name, salary, age):
    
        new_player = Player(name, salary, age)
        new_player.next_node = self.head
        self.head = new_player 
        

    #TODO: figure out more about these __method__ things, don't really understand them.
    def __len__(self):
        current_player = self.head
        cnt = 0

        while current_player is not None:
            cnt += 1
            current_player = current_player.next_node 

        return cnt

    def test_print(self):
        current = self.head

        while current is not None:
            print(f'Name: {current._name}   Salary: {current._salary}  Age: {current._age}') 
            current = current.next_node
