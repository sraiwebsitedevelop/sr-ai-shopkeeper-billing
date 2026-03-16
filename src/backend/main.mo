import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

actor Main {
  // Authorization state
  let _accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  // Include authorization mixin
  include MixinAuthorization(_accessControlState);

  // Include blob storage mixin
  include MixinStorage();

  // ── Data Types ──────────────────────────────────────────────────────────────

  type OrderItem = {
    productName : Text;
    photoBlobId : Text;
    price : Float;
    discount : Float;
    itemTotal : Float;
  };

  type Prescription = {
    photoBase64 : Text;
    rightSph : Text;
    rightCyl : Text;
    rightAxis : Text;
    rightNear : Text;
    leftSph : Text;
    leftCyl : Text;
    leftAxis : Text;
    leftNear : Text;
  };

  type Order = {
    id : Text;
    customerName : Text;
    customerMobile : Text;
    customerAddress : Text;
    items : [OrderItem];
    prescription : ?Prescription;
    total : Float;
    discountAmount : Float;
    grandTotal : Float;
    advance : Float;
    dues : Float;
    netTotal : Float;
    transactionType : Text;
    status : Text;
    createdAt : Int;
  };

  type ShopkeeperProfile = {
    shopName : Text;
    mobileNumber : Text;
  };

  // ── State ────────────────────────────────────────────────────────────────────

  let orders : Map.Map<Text, Order> = Map.empty();
  var shopkeeperProfile : ?ShopkeeperProfile = null;

  // ── Shopkeeper Profile ───────────────────────────────────────────────────────

  public shared func saveShopkeeperProfile(profile : ShopkeeperProfile) : async () {
    shopkeeperProfile := ?profile;
  };

  public query func getShopkeeperProfile() : async ?ShopkeeperProfile {
    shopkeeperProfile;
  };

  // ── Orders ───────────────────────────────────────────────────────────────────

  public shared func createOrder(order : Order) : async Text {
    orders.add(order.id, order);
    order.id;
  };

  public query func getOrders() : async [Order] {
    orders.values().toArray();
  };

  public query func getOrder(id : Text) : async ?Order {
    orders.get(id);
  };

  public shared func updateOrderStatus(id : Text, status : Text) : async Bool {
    switch (orders.get(id)) {
      case (null) { false };
      case (?order) {
        let updated : Order = {
          id = order.id;
          customerName = order.customerName;
          customerMobile = order.customerMobile;
          customerAddress = order.customerAddress;
          items = order.items;
          prescription = order.prescription;
          total = order.total;
          discountAmount = order.discountAmount;
          grandTotal = order.grandTotal;
          advance = order.advance;
          dues = order.dues;
          netTotal = order.netTotal;
          transactionType = order.transactionType;
          status = status;
          createdAt = order.createdAt;
        };
        orders.add(id, updated);
        true;
      };
    };
  };

  public shared func deleteOrder(id : Text) : async Bool {
    orders.remove(id);
    true;
  };
};
